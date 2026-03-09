import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../models/study_material.dart';

class QuizResultsScreen extends StatefulWidget {
  final String id;
  const QuizResultsScreen({super.key, required this.id});

  @override
  State<QuizResultsScreen> createState() => _QuizResultsScreenState();
}

class _QuizResultsScreenState extends State<QuizResultsScreen> {
  int _currentQuestion = 0;
  int? _selectedOption;
  bool _showResult = false;
  int _score = 0;
  bool _isFinished = false;

  // Mock data for now, ideally fetched from storage by id
  final List<QuizQuestion> _questions = [
    QuizQuestion(
      question: "What is the primary function of Mitochondria?",
      options: ["Protein Synthesis", "ATP Production", "Waste Disposal", "Cell Division"],
      answer: 1,
    ),
    QuizQuestion(
      question: "Which process occurs in the Mitochondria?",
      options: ["Glycolysis", "Krebs Cycle", "Photosynthesis", "Mitosis"],
      answer: 1,
    ),
  ];

  void _handleSelect(int index) {
    if (_showResult) return;
    setState(() {
      _selectedOption = index;
    });
  }

  void _checkAnswer() {
    if (_selectedOption == null) return;
    final isCorrect = _selectedOption == _questions[_currentQuestion].answer;
    setState(() {
      if (isCorrect) _score++;
      _showResult = true;
    });
  }

  void _nextQuestion() {
    setState(() {
      if (_currentQuestion < _questions.length - 1) {
        _currentQuestion++;
        _selectedOption = null;
        _showResult = false;
      } else {
        _isFinished = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isFinished) return _buildFinishedView();

    final question = _questions[_currentQuestion];
    final progress = (_currentQuestion / _questions.length);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(progress),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    _buildQuestionBox(question),
                    ...List.generate(question.options.length, (i) => _buildOption(question, i)),
                  ],
                ),
              ),
            ),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(double progress) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.close, color: AppColors.charcoal),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: const Color(0xFFE2E8F0),
                color: AppColors.electricBlue,
                minHeight: 8,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
          Text(
            '${_currentQuestion + 1}/${_questions.length}',
            style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.slate600),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionBox(QuizQuestion question) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      margin: const EdgeInsets.only(bottom: 32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Text(
        question.question,
        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.charcoal, lineHeight: 1.4),
      ),
    ).animate(key: ValueKey(_currentQuestion)).fadeIn().slideX(begin: 0.1, end: 0);
  }

  Widget _buildOption(QuizQuestion question, int index) {
    Color bgColor = Colors.white;
    Color borderColor = const Color(0xFFE2E8F0);

    if (_selectedOption == index) {
      bgColor = const Color(0xFFEEF2FF);
      borderColor = const Color(0xFF6366F1);
    }

    if (_showResult) {
      if (index == question.answer) {
        bgColor = const Color(0xFFECFDF5);
        borderColor = const Color(0xFF10B981);
      } else if (index == _selectedOption) {
        bgColor = const Color(0xFFFEF2F2);
        borderColor = const Color(0xFFEF4444);
      }
    }

    return GestureDetector(
      onTap: () => _handleSelect(index),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Row(
          children: [
            _buildOptionDot(index, question),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                question.options[index],
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.charcoal),
              ),
            ),
            if (_showResult && index == question.answer)
              const Icon(Icons.check_circle, color: Color(0xFF10B981))
            else if (_showResult && index == _selectedOption && index != question.answer)
              const Icon(Icons.cancel, color: Color(0xFFEF4444)),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionDot(int index, QuizQuestion question) {
    Color dotBorderColor = const Color(0xFFCBD5E1);
    Color? dotFillColor;

    if (_selectedOption == index) dotBorderColor = const Color(0xFF6366F1);
    
    if (_showResult) {
      if (index == question.answer) {
        dotBorderColor = const Color(0xFF10B981);
        dotFillColor = const Color(0xFF10B981);
      } else if (index == _selectedOption) {
        dotBorderColor = const Color(0xFFEF4444);
        dotFillColor = const Color(0xFFEF4444);
      }
    }

    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: dotBorderColor, width: 2),
        color: dotFillColor,
      ),
      child: _selectedOption == index && !_showResult
          ? Center(
              child: Container(
                width: 12,
                height: 12,
                decoration: const BoxDecoration(color: Color(0xFF6366F1), shape: BoxShape.circle),
              ),
            )
          : null,
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: _selectedOption == null ? null : (_showResult ? _nextQuestion : _checkAnswer),
          style: ElevatedButton.styleFrom(
            backgroundColor: _showResult ? const Color(0xFF10B981) : AppColors.electricBlue,
            foregroundColor: Colors.white,
            disabledBackgroundColor: const Color(0xFFCBD5E1),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 0,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                !_showResult ? 'Check Answer' : (_currentQuestion < _questions.length - 1 ? 'Next Question' : 'Finish Quiz'),
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              if (_showResult) ...[
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward, size: 20),
              ]
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFinishedView() {
    final accuracy = (_score / _questions.length) * 100;
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF8FAFC), Color(0xFFEFF6FF)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Center(
          child: Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 24,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: const BoxDecoration(color: Color(0xFFEEF2FF), shape: BoxShape.circle),
                  child: const Icon(Icons.emoji_events, size: 48, color: AppColors.electricBlue),
                ),
                const SizedBox(height: 24),
                const Text('Quiz Complete!', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal)),
                const SizedBox(height: 8),
                const Text('Great job mastering this topic.', style: TextStyle(fontSize: 16, color: AppColors.slate600), textAlign: TextAlign.center),
                const SizedBox(height: 32),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    children: [
                      _buildStatItem('$_score/${_questions.length}', 'Score'),
                      Container(width: 1, height: 40, color: const Color(0xFFE2E8F0)),
                      _buildStatItem('${accuracy.round()}%', 'Accuracy'),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: TextButton(
                        onPressed: () => context.pop(),
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: const Color(0xFFF1F5F9),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text('Back to Hub', style: TextStyle(color: AppColors.charcoal, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _isFinished = false;
                            _currentQuestion = 0;
                            _score = 0;
                            _selectedOption = null;
                            _showResult = false;
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor: AppColors.electricBlue,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text('Retake Quiz', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ).animate().fadeIn(duration: 800.ms).scale(),
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Expanded(
      child: Column(
        children: [
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.electricBlue)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.slate600)),
        ],
      ),
    );
  }
}
