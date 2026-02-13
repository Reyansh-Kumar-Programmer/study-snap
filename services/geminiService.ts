import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || '');

export const generateStudyMaterial = async (imageUri: string) => {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing");
        // Return mock data for demo if key is missing
        return MOCK_RESULT;
    }

    try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert study assistant. Analyze this image of study notes.
      Provide the following in JSON format:
      1. "explanation": A clear, simple explanation of the concepts found.
      2. "summary": A concise summary (max 3 bullet points).
      3. "quiz": An array of 3 multiple choice questions with "question", "options" (array of 4 strings), and "answer" (index 0-3).
      
      Response must be valid JSON only, no markdown formatting.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

const MOCK_RESULT = {
    explanation: "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.",
    summary: [
        "Converts light energy to chemical energy.",
        "Occurs in chloroplasts.",
        "Produces glucose and oxygen."
    ],
    quiz: [
        {
            question: "Where does photosynthesis occur?",
            options: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosomes"],
            answer: 1
        },
        {
            question: "What is the primary output of photosynthesis?",
            options: ["Carbon Dioxide", "Water", "Glucose", "Nitrogen"],
            answer: 2
        },
        {
            question: "Which pigment absorbs light energy?",
            options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"],
            answer: 1
        }
    ]
};
