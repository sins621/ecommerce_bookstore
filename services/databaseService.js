import pg from "pg";
import "dotenv/config";

const CLIENT_INFO = {
  user: "postgres",
  host: process.env.DB_HOST,
  database: "book_website",
  password: process.env.DB_PASS,
  port: 5432,
};

const database = new pg.Client(CLIENT_INFO);
database.connect();

const databaseService = {
  fetchAllBooks: async () => {
    return (await database.query("SELECT * FROM books")).rows;
  },

  fetchBooksBy: async (filter, value) => {
    switch (filter) {
      case "category":
        return (
          await database.query(
            `
            SELECT * FROM books
            WHERE category=$1
            `,
            [value]
          )
        ).rows;
      case "id":
        return (
          await database.query(
            `
            SELECT * FROM books 
            WHERE id = $1
            `,
            [value]
          )
        ).rows;
    }
  },

  fetchBookReviews: async (bookId) => {
    return (
      await database.query(
        `
        SELECT * FROM book_reviews
        WHERE book_id = $1
        `,
        [bookId]
      )
    ).rows;
  },

  fetchCartItems: async (userId) => {
    return (
      await database.query(
        `
        SELECT * FROM carts
        WHERE user_id = $1
        `,
        [userId]
      )
    ).rows;
  },

  fetchUsersBy: async (filter, value) => {
    switch (filter) {
      case "email":
        return (
          await database.query(
            `
            SELECT * FROM users 
            WHERE email = $1
            `,
            [value]
          )
        ).rows;
      case "id":
        return (
          await database.query(
            `
            SELECT * FROM users 
            WHERE id = $1
            `,
            [value]
          )
        ).rows;
      case "none":
        return (
          await database.query(
            `
            SELECT * FROM users
            `
          )
        ).rows;
    }
  },

  fetchAllUsersRoles: async () => {
    const query = (
      await database.query(
        `
        SELECT 
          user_id,
          email,
          string_agg(role, ',') AS roles
          FROM 
              user_roles
          GROUP BY
              user_id, email;
        `
      )
    ).rows;

    return query.map(user => {
      return {
        user_id: user.user_id,
        email: user.email,
        roles: user.roles.split(","),
      }
    })
  },

  fetchUserByHighestRole: async (id) => {
    return (
      await database.query(
        `
        SELECT email, role,
          CASE
            WHEN role = 'admin' THEN 'admin'
            WHEN role = 'user' THEN 'user'
            ELSE 'other'
          END AS role
        FROM user_roles
        WHERE user_id = $1
          ORDER BY CASE
            WHEN role = 'admin' THEN 1
            WHEN role = 'user' THEN 2
            ELSE 3
          END
        LIMIT 1;
        `,
        [id]
      )
    ).rows[0];
  },

  fetchSubscribers: async () => {
    return (
      await database.query(
        `
        SELECT * FROM public.subscribers
        `
      )
    ).rows;
  },

  fetchCategories: async () => {
    const categoryObjects = (
      await database.query(
        `
      SELECT name FROM public.categories
      `
      )
    ).rows;
    const categories = [];
    categoryObjects.map((category) => {
      categories.push(category.name);
    });
    return categories;
  },

  addBookReview: async (reviewInfo) => {
    return (
      await database.query(
        `
        INSERT INTO book_reviews (
          review_title,
          reviewer_name,
          review_text,
          user_id,
          review_rating,
          book_id,
          review_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, now())
        RETURNING *
        `,
        reviewInfo
      )
    ).rows[0];
  },

  addBook: async (bookInfo) => {
    return (
      await database.query(
        `
        INSERT INTO books 
        (
          title,
          author,
          category,
          publish_year,
          abstract,
          cover_id,
          quantity,
          price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        bookInfo
      )
    ).rows[0];
  },

  addSubscriber: async (email) => {
    try {
      return (
        await database.query(
          `
          INSERT INTO public.subscribers
          (
            email
          )
          VALUES
          ($1)
          RETURNING id
          `,
          [email]
        )
      ).rows[0].id;
    } catch (err) {
      if (err.code !== "23505") throw new Error(err);

      return 0;
    }
  },

  addBookToCart: async (bookId, userId) => {
    const BOOK_INFO = (await databaseService.fetchBooksBy("id", bookId))[0];

    return (
      await database.query(
        `
        INSERT INTO public.carts
        (
          book_id,
          user_id,
          book_title,
          book_price,
          book_remaining,
          amount
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (book_id, user_id)
        DO UPDATE SET amount = public.carts.amount + 1
        RETURNING *;
        `,
        [
          bookId,
          userId,
          BOOK_INFO.title,
          BOOK_INFO.price,
          BOOK_INFO.quantity,
          1,
        ]
      )
    ).rows[0];
  },

  addUser: async (email, hash, name) => {
    var userTableUser = (
      await database.query(
        `
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3) RETURNING *
        `,
        [email, hash, name]
      )
    ).rows[0];

    const USER_ROLE_ID = 2;
    const USER_ROLE_NAME = "user";
    var roleTableUser = (
      await database.query(
        `
        INSERT INTO user_roles (user_id, role_id, email, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [userTableUser.id, USER_ROLE_ID, email, USER_ROLE_NAME]
      )
    ).rows[0];

    return {
      id: userTableUser.id,
      email: roleTableUser.email,
      role: roleTableUser.role,
    };
  },

  addLog: async ({
    event = null,
    object = null,
    description = null,
    createdBy = null,
  } = {}) => {
    return await database.query(
      `
      INSERT INTO public.logs
      (
        event,
        object,
        description,
        created_on,
        created_by
      )
      VALUES
      ($1, $2, $3, now(), $4)
      RETURNING id
      `,
      [event, object, description, createdBy]
    );
  },

  //flawed
  updateRole: async (role, email) => {
    return await database.query(
      `
      UPDATE user_roles
      SET role = $1
      WHERE email = $2
      RETURNING id
      `,
      [role, email]
    );
  },

  deleteBookFromCart: async (userId, bookId) => {
    return await database.query(
      `
      DELETE from carts
      WHERE 
        user_id = $1
      AND
        book_id = $2
      RETURNING *
      `,
      [userId, bookId]
    );
  },

  deleteUser: async (email) => {
    const USER_ID = (await fetchUsersBy("email", email))[0].id;
    await database.query(
      `
      DELETE FROM user_roles
      WHERE email = $1
      `,
      [email]
    );

    await database.query(
      `
      DELETE FROM subscribers
      WHERE email = $1
      `,
      [email]
    );

    await database.query(
      `
      DELETE FROM carts
      WHERE user_id = $1
      `,
      [USER_ID]
    );

    await database.query(
      `
      DELETE FROM users
      WHERE email = $1
      `,
      [email]
    );
  },
};

export default databaseService;
