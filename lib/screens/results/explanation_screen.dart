import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../../core/theme.dart';

class ExplanationScreen extends StatefulWidget {
  final String id;
  const ExplanationScreen({super.key, required this.id});

  @override
  State<ExplanationScreen> createState() => _ExplanationScreenState();
}

class _ExplanationScreenState extends State<ExplanationScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isTyping = true;
  bool _initialTypingDone = false;
  String _fullExplanation = "Mitochondria are often referred to as the 'powerhouses of the cell'. They are membrane-bound organelles found in the cytoplasm of almost all eukaryotic cells, the primary function of which is to generate large quantities of energy in the form of adenosine triphosphate (ATP).\n\nKey functions include:\n1. ATP Production: Through aerobic respiration.\n2. Calcium Storage: Helping maintain cell homeostasis.\n3. Heat Production: In specialized tissues like brown fat.";
  String _displayedExplanation = "";

  @override
  void initState() {
    super.initState();
    _startTypewriterEffect();
  }

  void _startTypewriterEffect() {
    int i = 0;
    Timer.periodic(const Duration(milliseconds: 10), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      setState(() {
        _displayedExplanation = _fullExplanation.substring(0, i);
        i++;
      });
      if (i > _fullExplanation.length) {
        timer.cancel();
        setState(() {
          _initialTypingDone = true;
          _isTyping = false;
          _messages.add({'text': _fullExplanation, 'isAi': true});
        });
      }
    });
  }

  void _handleSend() {
    final text = _controller.text.trim();
    if (text.isEmpty || _isTyping) return;

    setState(() {
      _messages.add({'text': text, 'isAi': false});
      _controller.clear();
      _isTyping = true;
    });

    // Mock AI response
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _messages.add({
            'text': "That's a great question! Mitochondria actually have their own DNA, separate from the cell's nucleus, which is why they can reproduce independently within the cell.",
            'isAi': true
          });
          _isTyping = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF0FDF4), Colors.white],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(),
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: _initialTypingDone ? _messages.length + (_isTyping ? 1 : 0) : 1,
                    itemBuilder: (context, index) {
                      if (!_initialTypingDone) {
                        return _buildAiBubble(_displayedExplanation, isTypewriter: true);
                      }
                      if (index == _messages.length) {
                        return _buildTypingIndicator();
                      }
                      final msg = _messages[index];
                      return _buildMessageRow(msg['text'], msg['isAi']);
                    },
                  ),
                ),
                _buildInputArea(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back, color: AppColors.charcoal),
            style: IconButton.styleFrom(backgroundColor: const Color(0xFFF1F5F9)),
          ),
          const Row(
            children: [
              Text('AI Tutor', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal)),
              SizedBox(width: 8),
              CircleAvatar(radius: 4, backgroundColor: Color(0xFF10B981)),
            ],
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.more_horiz, color: AppColors.charcoal),
            style: IconButton.styleFrom(backgroundColor: const Color(0xFFF1F5F9)),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageRow(String text, bool isAi) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        mainAxisAlignment: isAi ? MainAxisAlignment.start : MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (isAi) ...[
            const CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.electricBlue,
              child: Icon(Icons.school, size: 16, color: Colors.white),
            ),
            const SizedBox(width: 10),
          ],
          _buildAiBubble(text, isAi: isAi),
        ],
      ),
    ).animate().fadeIn().slideX(begin: isAi ? -0.1 : 0.1, end: 0);
  }

  Widget _buildAiBubble(String text, {bool isAi = true, bool isTypewriter = false}) {
    return Container(
      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: isAi ? Colors.white : AppColors.electricBlue,
        borderRadius: BorderRadius.only(
          topLeft: const Radius.circular(28),
          topRight: const Radius.circular(28),
          bottomRight: isAi ? const Radius.circular(28) : const Radius.circular(8),
          bottomLeft: isAi ? const Radius.circular(8) : const Radius.circular(28),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF64748B).withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: isAi ? Border.all(color: const Color(0xFFF1F5F9)) : null,
      ),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: text,
              style: TextStyle(
                fontSize: 16,
                height: 1.5,
                color: isAi ? AppColors.charcoal : Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (isTypewriter)
              const TextSpan(
                text: ' ▋',
                style: TextStyle(color: AppColors.electricBlue, fontWeight: FontWeight.bold),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.electricBlue,
            child: Icon(Icons.school, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(AppColors.electricBlue)),
            ),
          ),
        ],
      ),
    ).animate().fadeIn();
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: TextField(
                controller: _controller,
                maxLines: null,
                enabled: _initialTypingDone && !_isTyping,
                decoration: InputDecoration(
                  hintText: _initialTypingDone ? "Ask a follow up question..." : "Tutor is typing...",
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: _handleSend,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: (_controller.text.isEmpty || !_initialTypingDone || _isTyping) ? const Color(0xFFCBD5E1) : AppColors.electricBlue,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }
}

