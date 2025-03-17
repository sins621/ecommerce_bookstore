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

  addBooktoCart: async (req, res) => {
    // TODO: Add Check for User Logged In
    const bookId = req.body.book_id;
    await databaseService.addBookToCart(bookId, req.user.id);
    await res.send("OK").status(200);
  },
};

export default userController;
