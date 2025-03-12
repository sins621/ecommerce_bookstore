import { GoogleGenerativeAI } from "@google/generative-ai";

export default class API {
  constructor(app) {
    this.app = app;
  }

  async addBookRoute(fetchBooks) {
    this.app.post("/add_book", async (req, res) => {
      if (!req.body) return res.send("Server Error").status(500);
      const BOOKS = fetchBooks(req.body.author, req.body.title);
      return res.render("add_book.ejs", { books: BOOKS, categories: CATEGORIES });
    });
  }

  async updateRoleRoute(updateRole) {
    this.app.post("/update_role", async (req, res) => {
      updateRole(req.body.role, req.body.email);
    });
  }

  async deleteUserRoute(deleteUser) {
    this.app.delete("/delete_user", async (req, res) => {
      deleteUser(req.body.email);
    });
  }

  async geminiPromptRoute() {
    this.app.get("/api/ai_abstract", async (req, res) => {
      const AUTHOR = req.query.author;
      const TITLE = req.query.title;
      const GEN_AI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
      const MODEL = GEN_AI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const PROMPT = `Provide a 20-30 word abstract for the Book ${TITLE} by ${AUTHOR}`;
      const RESULT = await MODEL.generateContent(PROMPT);
      const TEXT = RESULT.response.candidates[0].content.parts[0].text;

      return res.send(TEXT);
    });
  }
}
