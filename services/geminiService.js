import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const geminiService = {
  fetchBookAbstract: async (author, title) => {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Provide a 20-30 word abstract for the Book ${title} by ${author}`;
    const result = await model.generateContent(prompt);
    return result.response.candidates[0].content.parts[0].text;
  },
};

export default geminiService;