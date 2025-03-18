import databaseService from "../services/databaseService.js";
import geminiService from "../services/geminiService.js";
import openLibraryService from "../services/openLibraryService.js";

const bookController = {
  allBooks: async (req, res) => {
    const books = await databaseService.fetchAllBooks();
    if (books.length == 0) return res.status(500);
    return res.json(books);
  },

  fetchBookBy: async (req, res) => {
    const filter = req.query.filter;
    const value = req.query.value;
    const filteredBooks = await databaseService.fetchBooksBy(filter, value);
    return res.json(filteredBooks);
  },

  fetchBookAbstract: async (req, res) => {
    const author = req.query.author;
    const title = req.query.title;
    const bookAbstract = await geminiService.fetchBookAbstract(author, title);
    return res.json({ abstract: bookAbstract });
  },

  fetchBookDetails: async (req, res) => {
    const author = req.query.author;
    const title = req.query.title;
    const bookDetails = await openLibraryService.fetchBookDetails(
      author,
      title
    );
    return res.json(bookDetails);
  },

  fetchCategories: async (req, res) => {
    return res.json(await databaseService.fetchCategories());
  },

  addBook: async (req, res) => {
    await databaseService.addBook([
      req.body.title,
      req.body.author,
      req.body.category,
      req.body.publish_year,
      req.body.abstract,
      req.body.cover_id,
      req.body.quantity,
      req.body.price,
    ]);
    return res.send("OK").status(200);
  },
};

export default bookController;
