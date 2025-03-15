import databaseService from "../services/databaseService.js";

const viewController = {
  home: async (req, res) => {
    const books = await databaseService.fetchAllBooks();

    if (books.length === 0)
      return res.send("Error Retrieving Books").status(500);

    if (!req.isAuthenticated())
      return res.render("index.ejs", {
        user: req.user,
      });
    
    const cart = await databaseService.fetchCartItems(req.user.id);
    return res.render("index.ejs", {
      cart,
      user: req.user,
    });
  },
};

export default viewController;
