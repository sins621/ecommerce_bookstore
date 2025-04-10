const devController = {
  addBook: async (req, res) => {
    return res.render("routes/add_book.ejs");
  },
};

export default devController;
