import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("EXPO_PUBLIC_GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(API_KEY);

export const GEMINI_MODEL = "gemini-2.5-flash-lite";

export const getGeminiResponse = async (userMessage: string, history: { role: "user" | "model"; parts: { text: string }[] }[] = []) => {
    try {
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            systemInstruction: "You are TutorXpert, a professional and friendly AI tutor. Help students with their academic questions, explain complex concepts clearly, provide examples, and practice MCQs or numericals. Use markdown for better readability.",
        });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
