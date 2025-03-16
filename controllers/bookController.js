import databaseService from "../services/databaseService.js";
import geminiService from "../services/geminiService.js";
import openLibraryService from "../services/openLibraryService.js";

const bookController = {
  allBooks: async (req, res) => {
    const books = await databaseService.fetchAllBooks();
    if (books.length == 0) return res.status(500);
    return res.json(books);
  },
  fetchBookAbstract: async (req, res) => {
    const author = req.query.author;
    const title = req.query.title;
    const bookAbstract = await geminiService.fetchBookAbstract(author, title);
    return res.json({abstract: bookAbstract});
  },

  fetchBookDetails: async (req, res) => {
    const author = req.query.author;
    const title = req.query.title;
    const bookDetails = await openLibraryService.fetchBookDetails(author, title)
    return res.json(bookDetails);
  },
};

export default bookController;
