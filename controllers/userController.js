import databaseService from "../services/databaseService.js";

const userController = {
  fetchAllUsers: async (req, res) => {
    const users = await databaseService.fetchUsersBy();
    return res.json({ users });
  },

  fetchUserById: async (req, res) => {
    const userId = req.params.id;
    const users = await databaseService.fetchUsersBy("id", userId);
    if (users.length === 0) res.status(404).json({ message: "User not found" });
    const user = users[0];
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  },

  fetchCartItems: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await databaseService.fetchCartItems(userId);
      if (cartItems.length === 0) res.status(500);
      return res.json({ cart: cartItems });
    } catch (err) {
      console.log(err);
    }
  },

  fetchAllRoles: async (req, res) => {
    return res.json(await databaseService.fetchAllRoles());
  },

  fetchUserRoles: async (req, res) => {
    return res.json(await databaseService.fetchAllUsersRoles());
  },

  fetchReviews: async (req, res) => {
    const reviews = await databaseService.fetchBookReviews(req.params.id);
    console.log(reviews);
    return res.json({ reviews });
  },

  addBooktoCart: async (req, res) => {
    // TODO: Add Check for User Logged In
    const bookId = req.body.book_id;
    await databaseService.addBookToCart(req.user.id, bookId);
    const bookName = (await databaseService.fetchBooksBy("id", bookId))[0]
      .title;
    await databaseService.addLog({
      event: "Add",
      object: "Cart",
      description: `User ${req.user.email} added "${bookName}" to their Cart`,
      createdBy: req.user.email,
    });
    await res.json({ message: "OK" });
  },

  addOrders: async (req, res) => {
    const bookIds = req.body.book_ids;
    const userId = req.user.id;
    const bookTitles = [];

    bookIds.forEach(async (bookId) => {
      const bookTitle = (await databaseService.fetchBooksBy("id", bookId))[0]
        .title;
      bookTitles.push(bookTitle);
      await databaseService.deleteBookFromCart(userId, bookId);
      await databaseService.addBookToOrders(userId, bookId);
    });

    await databaseService.addLog({
      event: "Add",
      object: "Orders",
      description: `User "${req.user.email}" Added Books "${bookTitles}" to their Orders`,
      createdBy: req.user.email,
    });
    return res.json({ message: "Orders Added" });
  },

  addBookReview: async (req, res) => {
    const user = await databaseService.fetchUsersBy("id", req.user.id);
    const userName = user[0].name;
    await databaseService.addBookReview([
      req.body.review_title,
      userName,
      req.body.review_text,
      req.user.id,
      req.body.rating,
      req.body.book_id,
    ]);
    const bookName = (
      await databaseService.fetchBooksBy("id", req.body.book_id)
    )[0].title;
    await databaseService.addLog({
      event: "Add",
      object: "Reviews",
      description: `User ${req.user.email} added Review "${req.body.review_title}" to "${bookName}"`,
      createdBy: req.user.email,
    });
    await res.json({ message: "OK" });
  },

  addSubscriber: async (req, res) => {
    const email = req.body.email;
    const response = await databaseService.addSubscriber(email);
    if (!response)
      return res.json({ error: "Email is already subscribed" }).status(409);

    await databaseService.addLog({
      event: "Add",
      object: "Subscribers",
      description: `Email "${req.body.email}" added to Subscription List`,
      createdBy: "Anonymous",
    });
    return res.json({ message: "Email added successfully." }).status(201);
  },

  addRole: async (req, res) => {
    const userId = req.body.user_id;
    const roleId = req.body.role_id;
    await databaseService.addRole(userId, roleId);
    const userEmail = (await databaseService.fetchUsersBy("id", userId))[0]
      .email;
    const roleName = (await databaseService.fetchRole(roleId))[0].role;
    await databaseService.addLog({
      event: "Add",
      object: "Roles",
      description: `Role "${roleName}" added to User "${userEmail}"`,
      createdBy: req.user.email,
    });
    await res.json({ message: "Role Successfully Added" }).status(201);
  },

  deleteBookFromCart: async (req, res) => {
    const userId = req.user.id;
    const bookId = req.body.book_id;
    await databaseService.deleteBookFromCart(userId, bookId);
    const bookName = (await databaseService.fetchBooksBy("id", bookId))[0]
      .title;
    await databaseService.addLog({
      event: "Remove",
      object: "Cart",
      description: `User ${req.user.email} removed "${bookName}" from their Cart`,
      createdBy: req.user.email,
    });
    res.json({ message: "Book Removed From Cart Successfully." });
  },

  deleteRole: async (req, res) => {
    const userId = req.body.user_id;
    const roleId = req.body.role_id;
    await databaseService.deleteRole(userId, roleId);
    const userEmail = (await databaseService.fetchUsersBy("id", userId))[0]
      .email;
    const roleName = (await databaseService.fetchRole(roleId))[0].role;
    await databaseService.addLog({
      event: "Remove",
      object: "Roles",
      description: `Role "${roleName}" removed from User "${userEmail}"`,
      createdBy: req.user.email,
    });
    await res.json({ message: "Role Successfully Removed" }).status(204);
  },

  deleteUser: async (req, res) => {
    const userId = req.body.user_id;
    const userEmail = (await databaseService.fetchUsersBy("id", userId))[0]
      .email;
    await databaseService.deleteUser(userId);
    await databaseService.addLog({
      event: "Remove",
      object: "Users",
      description: `User "${userEmail}" Removed from the Database`,
      createdBy: userEmail,
    });
    await res.json({ message: "User Successfully Deleted" }).status(204);
  },
};

export default userController;
