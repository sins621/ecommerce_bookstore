import { GoogleGenerativeAI } from "@google/generative-ai";

export default class API {
  constructor(app, db) {
    this.app = app;
    this.db = db;
    this.setupEndpoints();
  }

  async setupEndpoints() {
    this.updateRoleRoute();
    this.geminiPromptRoute();
  }

  async updateRoleRoute() {
    this.app.post("/update_role", async (req, res) => {
      console.log(req.body);
      this.db.updateRole(req.body.role, req.body.email)
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
