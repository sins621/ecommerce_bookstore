export default class Views {
  constructor(app) {
    this.app = app;
  }

  async home(books, categories) {
    this.app.get("/", async (req, res) => {
      if (books.length === 0)
        return res.send("Error Retrieving Books").status(500);

      return res.render("index.ejs", {
        categories: categories,
        books: books,
        user: req.user,
      });
    });
  }

  async addBook() {
    this.app.get("/add_book", async (req, res) => {
      if (req.isAuthenticated() === false) return res.render("login.ejs");

      if (req.user.role != "admin") return res.redirect("/");

      return res.render("add_book.ejs");
    });
  }
}
