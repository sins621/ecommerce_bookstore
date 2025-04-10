import amazonService from "../services/amazonService.js";
import databaseService from "../services/databaseService.js";
import geminiService from "../services/geminiService.js";
import openLibraryService from "../services/openLibraryService.js";
import "dotenv/config";
import crypto from "crypto";

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
    const coverLink = req.body.cover_id;
    const response = await fetch(coverLink);

    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const randomImageName = (bytes = 32) =>
      crypto.randomBytes(bytes).toString("hex");

    const imageName = randomImageName();
    amazonService.uploadImage({
      bucket: process.env.AWS_BUCKET_NAME,
      name: imageName,
      buffer: buffer,
    });

    const bookId = (
      await databaseService.query(
        `
      INSERT INTO books
      (
      title,
      author,
      publish_year,
      abstract,
      cover,
      quantity,
      price,
      isbn
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING book_id;
      `,
        [
          req.body.title,
          req.body.author,
          req.body.publish_year,
          req.body.abstract,
          imageName,
          req.body.quantity,
          req.body.price,
          req.body.isbn[0],
        ]
      )
    ).rows[0].book_id;

    await databaseService.query(
      `
      INSERT INTO books_categories (book_id, category_id)
      SELECT $1, category_id
      FROM categories
      WHERE name = $2;
      `,
      [bookId, req.body.category]
    );

    // await databaseService.addLog({
    //   event: "Add",
    //   object: "Books",
    //   description: `User "${req.user.email}" Added "${req.body.title}" to the Catalog`,
    //   createdBy: req.user.email,
    // });
    return res.json({ message: "Book Added" });
  },
};

export default bookController;
