import 'dart:convert';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../models/study_story.dart';

class GeminiService {
  final String apiKey;
  late final GenerativeModel _model;
  late final GenerativeModel _chatModel;

  GeminiService(this.apiKey) {
    _model = GenerativeModel(
      model: 'gemini-1.5-flash-latest',
      apiKey: apiKey,
    );
    _chatModel = GenerativeModel(
      model: 'gemini-1.5-flash-latest',
      apiKey: apiKey,
      systemInstruction: Content.system('You are an expert AI tutor explaining study material. Be super helpful, concise, and encourage learning. Use markdown for formatting.'),
    );
  }

  static dynamic _safeJSONParse(String text) {
    // Basic extraction of JSON block
    final firstBrace = text.indexOf('{');
    final lastBrace = text.lastIndexOf('}');
    if (firstBrace == -1 || lastBrace == -1) {
      throw Exception('Candidate does not contain a JSON object');
    }
    final jsonStr = text.substring(firstBrace, lastBrace + 1);
    
    try {
      return jsonDecode(jsonStr);
    } catch (e) {
      // Very basic cleanup for common Gemini artifacts
      final cleaned = jsonStr.replaceAll('\\', '');
      return jsonDecode(cleaned);
    }
  }

  Future<RevisionMaterial> generateRevisionSheet(String topic) async {
    if (apiKey.isEmpty) {
      // Mock delay
      await Future.delayed(const Duration(seconds: 2));
      return _mockRevisionData;
    }

    final prompt = '''
      You are an expert AI tutor. Generate a highly structured, comprehensive revision sheet for the topic: "$topic".
      
      Return exactly this JSON structure, and nothing else:
      {
          "topic": "The exact topic name",
          "subtitle": "A catchy, academic subtitle (1 sentence)",
          "summary": "A detailed, conceptually dense overview of the topic (3-4 paragraphs). Use markdown for emphasis.",
          "keyConcepts": [
              { "term": "Important Term 1", "definition": "Clear, concise definition" }
          ],
          "flow": [
              "Sequential Step/Concept 1"
          ],
          "examQuestions": [
              { "question": "A challenging mastery question", "type": "Conceptual", "answer": "The detailed correct answer and explanation." }
          ],
          "flashcards": [
              { "question": "Front of card concept", "answer": "Back of card explanation" }
          ]
      }
      
      Rules:
      - Provide 5 to 8 "keyConcepts".
      - Provide 4 to 6 "flow" sequences.
      - Provide 4 to 6 "examQuestions".
      - Provide 6 to 10 "flashcards".
      - Strictly valid JSON.
      - CRITICAL: Do NOT use LaTeX backslashes. Use Unicode symbols.
    ''';

    final response = await _model.generateContent([Content.text(prompt)]);
    final text = response.text;
    if (text == null) throw Exception('Empty response from Gemini');

    return RevisionMaterial.fromJson(_safeJSONParse(text));
  }

  Future<String> sendChatMessage(List<Map<String, String>> history, String message) async {
    if (apiKey.isEmpty) return "Mock response: API Key is missing.";

    final chatHistory = history.map((m) {
      return m['role'] == 'ai' 
          ? Content('model', [TextPart(m['text']!)]) 
          : Content('user', [TextPart(m['text']!)]);
    }).toList();

    final chat = _chatModel.startChat(history: chatHistory);
    final response = await chat.sendMessage(Content.text(message));
    return response.text ?? 'No response';
  }

  static final _mockRevisionData = RevisionMaterial(
    topic: "Quantum Mechanics",
    subtitle: "The Foundation of Modern Physics",
    summary: "Quantum mechanics is a fundamental theory in physics...",
    keyConcepts: [
      KeyConcept(term: "Wave-Particle Duality", definition: "Every particle may be described as either a particle or a wave."),
    ],
    flow: ["Classical Limits", "Photoelectric Effect"],
    examQuestions: [
      ExamQuestion(question: "Explain wave-particle duality.", type: "Conceptual", answer: "Particles like electrons show wave properties."),
    ],
    flashcards: [
      Flashcard(question: "Who proposed uncertainty?", answer: "Werner Heisenberg"),
    ],
  );
}
