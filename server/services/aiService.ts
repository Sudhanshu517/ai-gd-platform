import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIReport(topic: string, messages: string[]) {
  const prompt = `
Analyze this Group Discussion on topic: "${topic}".

Discussion Messages:
${messages.join("\n")}

Provide:
1. Summary of discussion
2. Key strengths of participants
3. Areas for improvement
4. Suggestions to improve communication skills
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
