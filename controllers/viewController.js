import databaseService from "../services/databaseService.js";

const viewController = {
  home: async (req, res) => {
    const books = await databaseService.fetchAllBooks();
    const categories = await databaseService.fetchCategories();

    if (books.length === 0)
      return res.send("Error Retrieving Books").status(500);

    if (!req.isAuthenticated())
      return res.render("index.ejs", {
        books,
        categories,
        user: req.user,
      });

    const cart = await databaseService.fetchCartItems(req.user.id);

    return res.render("index.ejs", {
      books,
      categories,
      user: req.user,
      cart,
    });
  },

  book: async (req, res) => {
    const bookId = req.params.id;
    const books = await databaseService.fetchBooksBy("id", bookId);

    if (books.length === 0)
      return res.send("Error Retrieving Book").status(500);
    const book = books[0];

    if (!req.isAuthenticated())
      return res.render("book_solo.ejs", {
        book,
      });

    const cart = await databaseService.fetchCartItems(req.user.id);

    return res.render("book_solo.ejs", {
      book,
      user: req.user,
      cart,
    });
  },

  loginForm: (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("login.ejs");
  },

  registerForm: (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("register.ejs");
  },

  register: async (req, res) => {
    if (!req.body) return res.send("Server Error").status(500);

    const EMAIL = req.body.username;
    const PASSWORD = req.body.password;
    const NAME = req.body.name;
    var checkResult = await databaseService.database.query(
      `SELECT * FROM users
     WHERE email = $1`,
      [EMAIL]
    );

    if (checkResult.rows.length > 0) return req.redirect("/login");

    const HASH = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
    const USER = await databaseService.addUser(EMAIL, HASH, NAME);
    databaseService.addLog({
      event: "Register",
      object: "Users",
      description: `User: ${USER.email} Registered an Account.`,
      createdBy: USER.email,
    });

    req.login(USER, (_err) => {
      console.log("success");

      return res.redirect("/");
    });
  },

  logout: (req, res) => {
    req.logout((err) => {
      if (err) return next(err);

      return res.redirect("/");
    });
  },
};

export default viewController;
