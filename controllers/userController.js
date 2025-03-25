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
    await databaseService.addBookToCart(bookId, req.user.id);
    await res.json({ message: "OK" });
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
    await res.json({ message: "OK" });
  },

  addSubscriber: async (req, res) => {
    const email = req.body.email;
    const response = await databaseService.addSubscriber(email);
    if (!response)
      return res.json({ error: "Email is already subscribed" }).status(409);

    return res.json({ message: "Email added successfully." }).status(201);
  },

  addRole: async (req, res) => {
    const userId = req.body.user_id;
    const roleId = req.body.role_id;
    await databaseService.addRole(userId, roleId);
    await res.json({ message: "Role Successfully Added" }).status(201);
  },

  deleteBookFromCart: async (req, res) => {
    const userId = req.user.id;
    const bookId = req.body.book_id;
    await databaseService.deleteBookFromCart(userId, bookId);
    res.json({ message: "Book Removed From Cart Successfully." });
  },

  deleteRole: async (req, res) => {
    const userId = req.body.user_id;
    const roleId = req.body.role_id;
    await databaseService.deleteRole(userId, roleId);
    await res.json({ message: "Role Successfully Removed" }).status(204);
  },

  deleteUser: async (req, res) => {
    const userId = req.body.user_id;
    await databaseService.deleteUser(userId);
    await res.json({ message: "User Successfully Deleted" }).status(204);
  }
};

export default userController;
