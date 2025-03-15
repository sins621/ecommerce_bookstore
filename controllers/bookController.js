import databaseService from "../services/databaseService.js";

const bookController = {
  allBooks: async (req, res) => {
    const books = await databaseService.fetchAllBooks();
    if (books.length == 0) return res.status(500);
    return res.json(books);
  }
};

export default bookController;
