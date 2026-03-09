import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';
import '../models/study_story.dart';
import '../services/gemini_service.dart';
import '../widgets/math_markdown.dart';
import '../widgets/flashcard_deck.dart';
import '../widgets/mastery_card.dart';

class RevisionSheetScreen extends StatefulWidget {
  final String topic;

  const RevisionSheetScreen({super.key, required this.topic});

  @override
  State<RevisionSheetScreen> createState() => _RevisionSheetScreenState();
}

class _RevisionSheetScreenState extends State<RevisionSheetScreen> {
  late Future<RevisionMaterial> _futureData;
  String _viewMode = 'sheet';
  final List<Map<String, String>> _chatHistory = [];

  @override
  void initState() {
    super.initState();
    final gemini = GeminiService(''); // API Key should be handled better
    _futureData = gemini.generateRevisionSheet(widget.topic);
  }

  void _openChat(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AiTutorModal(
        topic: widget.topic,
        history: _chatHistory,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: FutureBuilder<RevisionMaterial>(
        future: _futureData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final data = snapshot.data!;

          return Column(
            children: [
              _buildHeader(context),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTopicHeader(data),
                      _buildModeSwitcher(),
                      if (_viewMode == 'sheet') ...[
                        _buildSectionHeader('Key Concepts'),
                        _buildKeyConcepts(data),
                        _buildSectionHeader('Topic Analysis'),
                        MathMarkdown(data: data.summary),
                        _buildSectionHeader('Logic Sequence'),
                        _buildTimeline(data),
                        _buildSectionHeader('Mastery Check'),
                        ...data.examQuestions.map((q) => MasteryCard(question: q)),
                      ] else ...[
                        FlashcardDeck(cards: data.flashcards),
                      ],
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
              _buildChatTrigger(context),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.arrow_back, color: AppColors.charcoal),
            ),
            const Text(
              'Revision Sheet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoal,
              ),
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.share_outlined, color: AppColors.charcoal),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopicHeader(RevisionMaterial data) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          data.topic,
          style: const TextStyle(
            fontSize: 40,
            fontWeight: FontWeight.w900,
            color: AppColors.charcoal,
            height: 1.1,
            letterSpacing: -1.5,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          data.subtitle,
          style: const TextStyle(
            fontSize: 16,
            color: AppColors.slate600,
            height: 1.5,
          ),
        ),
      ],
    ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildModeSwitcher() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        children: [
          _ModePill(
            label: 'Overview',
            active: _viewMode == 'sheet',
            onTap: () => setState(() => _viewMode = 'sheet'),
          ),
          const SizedBox(width: 24),
          _ModePill(
            label: 'Flashcards',
            active: _viewMode == 'flashcards',
            onTap: () => setState(() => _viewMode = 'flashcards'),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String label) {
    return Padding(
      padding: const EdgeInsets.only(top: 24, bottom: 12),
      child: Text(
        label.toUpperCase(),
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: AppColors.electricBlue,
          letterSpacing: 2,
        ),
      ),
    );
  }

  Widget _buildKeyConcepts(RevisionMaterial data) {
    return SizedBox(
      height: 140,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: data.keyConcepts.length,
        itemBuilder: (context, index) {
          final concept = data.keyConcepts[index];
          return Container(
            width: 240,
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: index % 2 == 0 ? const Color(0xFFF4F4F5) : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.slate100, width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  concept.term,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.charcoal,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  concept.definition,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 13, color: AppColors.slate600),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimeline(RevisionMaterial data) {
    return Column(
      children: data.flow.asMap().entries.map((entry) {
        final idx = entry.key;
        final step = entry.value;
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: const BoxDecoration(
                    color: AppColors.charcoal,
                    shape: BoxShape.circle,
                  ),
                ),
                if (idx < data.flow.length - 1)
                  Container(
                    width: 1.5,
                    height: 50,
                    color: AppColors.slate100,
                  ),
              ],
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(
                  step,
                  style: const TextStyle(fontSize: 16, color: AppColors.charcoal),
                ),
              ),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildChatTrigger(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
      color: Colors.white,
      child: InkWell(
        onTap: () => _openChat(context),
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFE2E8F0), width: 1.5),
          ),
          child: Row(
            children: [
              const Icon(Icons.chat_bubble_outline, size: 18, color: AppColors.slate400),
              const SizedBox(width: 10),
              const Expanded(
                child: Text(
                  'Ask a follow-up question...',
                  style: TextStyle(fontSize: 15, color: AppColors.slate400),
                ),
              ),
              if (_chatHistory.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.charcoal,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${_chatHistory.length}',
                    style: const TextStyle(fontSize: 11, color: Colors.white),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ModePill extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;

  const _ModePill({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: active ? AppColors.charcoal : AppColors.slate400,
            ),
          ),
          if (active)
            Container(
              height: 2,
              width: 40,
              margin: const EdgeInsets.only(top: 4),
              color: AppColors.charcoal,
            ),
        ],
      ),
    );
  }
}

class AiTutorModal extends StatefulWidget {
  final String topic;
  final List<Map<String, String>> history;

  const AiTutorModal({super.key, required this.topic, required this.history});

  @override
  State<AiTutorModal> createState() => _AiTutorModalState();
}

class _AiTutorModalState extends State<AiTutorModal> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isTyping = false;

  void _handleSend() async {
    if (_controller.text.isEmpty) return;
    final msg = _controller.text;
    _controller.clear();
    setState(() {
      widget.history.add({'role': 'user', 'text': msg});
      _isTyping = true;
    });
    
    // Auto scroll
    Future.delayed(const Duration(milliseconds: 100), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });

    final gemini = GeminiService(''); // API Key should be handled better
    try {
      final response = await gemini.sendChatMessage(widget.history, msg);
      setState(() {
        widget.history.add({'role': 'ai', 'text': response});
        _isTyping = false;
      });
    } catch (e) {
      setState(() => _isTyping = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, controller) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: const BoxDecoration(
                            color: AppColors.charcoal,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.auto_awesome, size: 14, color: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'AI Tutor',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.keyboard_arrow_down, size: 28, color: AppColors.slate400),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              // Chat
              Expanded(
                child: ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(20),
                  itemCount: widget.history.length + (_isTyping ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == widget.history.length) {
                      return const Padding(
                        padding: EdgeInsets.symmetric(vertical: 8),
                        child: Text('AI is thinking...', style: TextStyle(color: AppColors.slate400)),
                      );
                    }
                    final msg = widget.history[index];
                    final isUser = msg['role'] == 'user';
                    return Align(
                      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isUser ? AppColors.electricBlue : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(20).copyWith(
                            bottomRight: isUser ? const Radius.circular(4) : null,
                            bottomLeft: !isUser ? const Radius.circular(4) : null,
                          ),
                        ),
                        child: MathMarkdown(
                          data: msg['text']!,
                          style: TextStyle(color: isUser ? Colors.white : AppColors.charcoal),
                        ),
                      ),
                    );
                  },
                ),
              ),
              // Input
              Padding(
                padding: EdgeInsets.fromLTRB(20, 8, 20, MediaQuery.of(context).viewInsets.bottom + 24),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: 'Ask a question...',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide.none,
                          ),
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      decoration: const BoxDecoration(
                        color: AppColors.charcoal,
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        onPressed: _handleSend,
                        icon: const Icon(Icons.arrow_upward, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
