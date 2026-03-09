import { GoogleGenAI } from '@google/genai';
import * as FileSystem from 'expo-file-system';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Initialize the Gemini API client
const genAI = new GoogleGenAI({ apiKey: API_KEY || '' });

/**
 * Robust JSON parser with multi-step fallback.
 * Hermes (React Native) is very strict about escape sequences in JSON.
 * This function tries multiple strategies to parse the JSON.
 */
const safeJSONParse = (text: string): any => {
    // Step 1: Extract JSON object from text
    let jsonStr = text;
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = text.substring(jsonStart, jsonEnd + 1);
    }

    // Step 2: Try parsing as-is (works if Gemini returned clean JSON)
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.warn('Direct JSON.parse failed, trying fallback sanitization...');
    }

    // Step 3: Remove all standalone backslashes that aren't valid JSON escapes.
    // We do this by replacing the raw string content.
    // Strategy: remove ALL backslashes, then the content is plain text without escape issues.
    try {
        const stripped = jsonStr.replace(/\\/g, '');
        return JSON.parse(stripped);
    } catch (e) {
        console.warn('Stripped backslash parse also failed, trying aggressive cleanup...');
    }

    // Step 4: Aggressive cleanup - also handle unescaped newlines and control chars
    try {
        let cleaned = jsonStr;
        // Replace literal control characters that might be in the string
        cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, (ch) => {
            if (ch === '\n') return '\\n';
            if (ch === '\r') return '\\r';
            if (ch === '\t') return '\\t';
            return '';
        });
        // Remove remaining backslashes
        cleaned = cleaned.replace(/\\/g, '');
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('All JSON parse attempts failed. Raw text:', jsonStr.substring(0, 200));
        throw new Error('Failed to parse Gemini response as JSON after all fallback attempts.');
    }
};

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
}

export interface RevisionMaterial {
    topic: string;
    subtitle: string;
    summary: string;
    keyConcepts: { term: string; definition: string }[];
    flow: string[];
    examQuestions: { question: string; type: string; answer: string }[];
    flashcards: { question: string; answer: string }[];
}

export interface StudyMaterial {
    explanation: string;
    summary: string[];
    quiz: QuizQuestion[];
}

export const generateStudyMaterial = async (imageUri: string): Promise<StudyMaterial> => {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing");
        // Return mock data for demo if key is missing
        return MOCK_RESULT;
    }

    try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        const prompt = `
            Analyze this image of study notes, textbooks, or handwriting. 
            Extract and organize the core educational content into a structured JSON format.
            
            Return exactly this structure:
            {
                "explanation": "A comprehensive yet easy-to-understand explanation of the key concepts identified in the image (2-4 paragraphs). Use markdown for bolding terms.",
                "summary": [
                    "Key point 1",
                    "Key point 2",
                    "Key point 3"
                ],
                "quiz": [
                    {
                        "question": "A multiple choice question based on the content.",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "answer": 0 
                    }
                ]
            }
            
            Rules:
            - The "answer" must be the index (0-3) of the correct option in the "options" array.
            - Provide up to 20 quiz questions.
            - Provide 5-15 summary points.
            - If handwriting is illegible, make an educated guess or focus on legible parts.
            - CRITICAL: Do NOT use any backslash characters in your output. Write math symbols using Unicode (like Delta, Psi) or plain English words instead of LaTeX notation. The JSON must not contain any backslash except for standard JSON string escapes.
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: base64,
                                mimeType: "image/jpeg"
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const candidate = result.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('Gemini API empty response:', result);
            throw new Error('No content was generated by the Gemini model.');
        }

        const parsed: StudyMaterial = safeJSONParse(text);

        // Basic validation
        if (!parsed.explanation || !Array.isArray(parsed.summary) || !Array.isArray(parsed.quiz)) {
            throw new Error('Invalid JSON structure returned by Gemini');
        }

        return parsed;

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

export const generateRevisionSheet = async (topic: string): Promise<RevisionMaterial> => {
    if (!API_KEY) {
        console.warn("Gemini API Key is missing. Returning mock data.");
        return new Promise(resolve => setTimeout(() => resolve(MOCK_REVISION_DATA), 1500));
    }

    try {
        const prompt = `
            You are an expert AI tutor. Generate a highly structured, comprehensive revision sheet for the topic: "${topic}".
            
            Return exactly this JSON structure, and nothing else:
            {
                "topic": "The exact topic name",
                "subtitle": "A catchy, academic subtitle (1 sentence)",
                "summary": "A detailed, conceptually dense overview of the topic (3-4 paragraphs). Use markdown for emphasis.",
                "keyConcepts": [
                    { "term": "Important Term 1", "definition": "Clear, concise definition" },
                    { "term": "Important Term 2", "definition": "Clear, concise definition" }
                ],
                "flow": [
                    "Sequential Step/Concept 1",
                    "Sequential Step/Concept 2",
                    "Sequential Step/Concept 3"
                ],
                "examQuestions": [
                    { "question": "A challenging mastery question", "type": "Conceptual or Mathematical or Theoretical or Application", "answer": "The detailed correct answer and explanation." }
                ],
                "flashcards": [
                    { "question": "Front of card concept", "answer": "Back of card explanation" }
                ]
            }

            Rules:
            - Provide 5 to 8 "keyConcepts".
            - Provide 4 to 6 "flow" sequences representing logical progression.
            - Provide 4 to 6 "examQuestions" with complete answers.
            - Provide 6 to 10 "flashcards" for quick recall.
            - Format must be strictly valid JSON.
            - CRITICAL: Do NOT use any backslash characters in your output. Write math symbols using Unicode characters (like Delta, Psi, Sigma) or plain English words instead of LaTeX notation. The JSON must not contain any backslash except for standard JSON string escapes like quotes.
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No content was generated by the Gemini model.');
        }

        const parsed: RevisionMaterial = safeJSONParse(text);

        // Basic validation
        if (!parsed.topic || !parsed.summary || !Array.isArray(parsed.keyConcepts)) {
            throw new Error('Invalid JSON structure returned by Gemini for Revision Sheet');
        }

        return parsed;

    } catch (error) {
        console.error('Gemini API Error (Revision Sheet):', error);
        throw error;
    }
};

const MOCK_REVISION_DATA: RevisionMaterial = {
    topic: "Quantum Mechanics",
    subtitle: "The Foundation of Modern Physics",
    summary: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science. Unlike classical physics, quantum mechanics introduces concepts like wave-particle duality, quantization of energy, and the uncertainty principle, which challenge our macroscopic intuitions about the universe.",
    keyConcepts: [
        { term: "Wave-Particle Duality", definition: "Every particle or quantum entity may be described as either a particle or a wave." },
        { term: "Quantization", definition: "The process of transitioning from a classical to a quantum description of a physical system." },
        { term: "Uncertainty Principle", definition: "The position and velocity of an object cannot both be measured exactly at the same time." },
        { term: "Superposition", definition: "A fundamental principle of quantum mechanics where a physical system exists in all possible states simultaneously." },
        { term: "Entanglement", definition: "A phenomenon where particles become correlated such that the state of one instantly influences the other." }
    ],
    flow: [
        "Classical Physics Limits",
        "Black Body Radiation",
        "Photoelectric Effect",
        "Schrödinger Equation",
        "Quantum Computing",
        "The Future of Information"
    ],
    examQuestions: [
        { question: "Explain the concept of wave-particle duality using the double-slit experiment.", type: "Conceptual", answer: "The double-slit experiment shows that light and matter can display characteristics of both classically defined waves and particles. When observed, particles pass through straight; unobserved, they create interference patterns." },
        { question: "Derive the basic form of the Heisenberg Uncertainty Principle.", type: "Mathematical", answer: "ΔxΔp ≥ ℏ/2. This states that the more precisely the position (x) of some particle is determined, the less precisely its momentum (p) can be predicted from initial conditions, and vice versa." },
        { question: "Discuss the implications of quantum entanglement on local realism.", type: "Theoretical", answer: "Entanglement violates local realism by showing that measurement of one particle instantaneously influences another, regardless of distance, defying the classical idea that influences cannot travel faster than light." },
        { question: "How does the Pauli Exclusion Principle explain the structure of the periodic table?", type: "Application", answer: "It prevents two identical fermions (like electrons) from occupying the same quantum state simultaneously, forcing electrons into higher energy shells and dictating chemical properties and bonding." }
    ],
    flashcards: [
        { question: "Who proposed the uncertainty principle?", answer: "Werner Heisenberg" },
        { question: "What is a 'quanta'?", answer: "A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents." },
        { question: "What does the Schrödinger equation describe?", answer: "The evolution of the wave function of a quantum system over time." }
    ]
};

const MOCK_RESULT: StudyMaterial = {
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

export const sendChatMessage = async (history: { role: string; text: string }[], newMessage: string) => {
    if (!API_KEY) {
        return "This is a mock response because the API key is missing. Feel free to ask another question!";
    }

    try {
        // Map history to the format expected by the GoogleGenAI SDK
        // Note: genAI SDK v2 uses 'user' and 'model' as roles
        const contents = history.map(h => ({
            role: h.role === 'ai' ? 'model' : 'user',
            parts: [{ text: h.text }]
        }));

        contents.push({
            role: 'user',
            parts: [{ text: newMessage }]
        });

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite", // Using flash-lite for speed and cost
            contents: contents,
            config: {
                systemInstruction: "You are an expert AI tutor explaining study material. Be super helpful, concise, and encourage learning. Use markdown for formatting.",
            }
        });

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No response from AI");
        return text;
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        throw error;
    }
};
