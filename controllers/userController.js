import databaseService from "../services/databaseService.js";

const userController = {
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

  fetchUserRoles: async (req, res) => {
    return res.json(await databaseService.fetchAllUsersRoles());
  },

  fetchReviews: async (req, res) => {
    const reviews = await databaseService.fetchBookReviews(req.params.id);
    console.log(reviews);
    return res.json({ reviews }).status(200);
  },

  addBooktoCart: async (req, res) => {
    // TODO: Add Check for User Logged In
    const bookId = req.body.book_id;
    await databaseService.addBookToCart(bookId, req.user.id);
    await res.send("OK").status(200);
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
    await res.send("OK").status(200);
  },

  addSubscriber: async (req, res) => {
    const email = req.body.email;
    const response = await databaseService.addSubscriber(email);
    if (!response)
      return res.json({ error: "Email is already subscribed" }).status(409);

    return res.json({ message: "Email added successfully." }).status(201);
  },

  deleteBookFromCart: async (req, res) => {
    const userId = req.user.id;
    const bookId = req.body.book_id;
    const response = await databaseService.deleteBookFromCart(userId, bookId);
    res.json({ message: "Book Removed From Cart Successfully." }).status(200);
  },
};

export default userController;
