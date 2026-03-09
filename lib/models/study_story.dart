class QuizQuestion {
  final String question;
  final List<String> options;
  final int answer;

  QuizQuestion({
    required this.question,
    required this.options,
    required this.answer,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      question: json['question'] as String,
      options: List<String>.from(json['options'] as List),
      answer: json['answer'] as int,
    );
  }
}

class KeyConcept {
  final String term;
  final String definition;

  KeyConcept({required this.term, required this.definition});

  factory KeyConcept.fromJson(Map<String, dynamic> json) {
    return KeyConcept(
      term: json['term'] as String,
      definition: json['definition'] as String,
    );
  }
}

class ExamQuestion {
  final String question;
  final String type;
  final String answer;

  ExamQuestion({
    required this.question,
    required this.type,
    required this.answer,
  });

  factory ExamQuestion.fromJson(Map<String, dynamic> json) {
    return ExamQuestion(
      question: json['question'] as String,
      type: json['type'] as String,
      answer: json['answer'] as String,
    );
  }
}

class Flashcard {
  final String question;
  final String answer;

  Flashcard({required this.question, required this.answer});

  factory Flashcard.fromJson(Map<String, dynamic> json) {
    return Flashcard(
      question: json['question'] as String,
      answer: json['answer'] as String,
    );
  }
}

class RevisionMaterial {
  final String topic;
  final String subtitle;
  final String summary;
  final List<KeyConcept> keyConcepts;
  final List<String> flow;
  final List<ExamQuestion> examQuestions;
  final List<Flashcard> flashcards;

  RevisionMaterial({
    required this.topic,
    required this.subtitle,
    required this.summary,
    required this.keyConcepts,
    required this.flow,
    required this.examQuestions,
    required this.flashcards,
  });

  factory RevisionMaterial.fromJson(Map<String, dynamic> json) {
    return RevisionMaterial(
      topic: json['topic'] as String,
      subtitle: json['subtitle'] as String,
      summary: json['summary'] as String,
      keyConcepts: (json['keyConcepts'] as List)
          .map((e) => KeyConcept.fromJson(e as Map<String, dynamic>))
          .toList(),
      flow: List<String>.from(json['flow'] as List),
      examQuestions: (json['examQuestions'] as List)
          .map((e) => ExamQuestion.fromJson(e as Map<String, dynamic>))
          .toList(),
      flashcards: (json['flashcards'] as List)
          .map((e) => Flashcard.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class StudyMaterial {
  final String explanation;
  final List<String> summary;
  final List<QuizQuestion> quiz;

  StudyMaterial({
    required this.explanation,
    required this.summary,
    required this.quiz,
  });

  factory StudyMaterial.fromJson(Map<String, dynamic> json) {
    return StudyMaterial(
      explanation: json['explanation'] as String,
      summary: List<String>.from(json['summary'] as List),
      quiz: (json['quiz'] as List)
          .map((e) => QuizQuestion.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
