import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';
import '../widgets/math_markdown.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Message> _messages = [
    Message(
      text: "Welcome back. I've analyzed your recent notes on cellular biology. Ready to dive deeper into the mitochondria's role in ATP production?",
      isAi: true,
    ),
  ];
  bool _isTyping = false;

  void _handleSend([String? text]) {
    final msgText = text ?? _controller.text.trim();
    if (msgText.isEmpty) return;

    setState(() {
      _messages.add(Message(text: msgText, isAi: false));
      _isTyping = true;
      if (text == null) _controller.clear();
    });

    // Mock AI response
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _messages.add(Message(
            text: "That's an interesting point! Let's explore how that connects to the electron transport chain.",
            isAi: true,
          ));
          _isTyping = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                itemCount: _messages.length + (_isTyping ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _messages.length) {
                    return _buildTypingIndicator();
                  }
                  return _buildMessageRow(_messages[index]);
                },
              ),
            ),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        border: const Border(bottom: BorderSide(color: Color(0x0D000000))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.chevron_left, size: 28, color: AppColors.charcoal),
            style: IconButton.styleFrom(
              backgroundColor: const Color(0xFFF1F5F9),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const _ShimmerTitle(),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.person_outline, size: 18, color: AppColors.charcoal),
            style: IconButton.styleFrom(
              backgroundColor: const Color(0xFFF1F5F9),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageRow(Message msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Align(
        alignment: msg.isAi ? Alignment.centerLeft : Alignment.centerRight,
        child: Container(
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
          padding: msg.isAi ? EdgeInsets.zero : const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: msg.isAi ? Colors.transparent : const Color(0xFFF1F5F9),
            borderRadius: BorderRadius.circular(18).copyWith(
              bottomRight: msg.isAi ? null : const Radius.circular(4),
              bottomLeft: msg.isAi ? const Radius.circular(4) : null,
            ),
          ),
          child: MathMarkdown(
            data: msg.text,
            style: const TextStyle(fontSize: 16, height: 1.5, color: AppColors.charcoal),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildTypingIndicator() {
    return const Padding(
      padding: EdgeInsets.only(left: 4, top: 5),
      child: Text(
        'Thinking through your notes...',
        style: TextStyle(
          fontSize: 13,
          color: AppColors.slate400,
          fontStyle: FontStyle.italic,
        ),
      ),
    ).animate().fadeIn();
  }

  Widget _buildFooter() {
    final options = [
      {'label': 'Summarize', 'icon': Icons.document_text_outlined},
      {'label': 'Create Quiz', 'icon': Icons.school_outlined},
      {'label': 'Explain', 'icon': Icons.lightbulb_outline},
      {'label': 'Flashcards', 'icon': Icons.layers_outlined},
    ];

    return Container(
      padding: const EdgeInsets.only(top: 10, bottom: 20),
      color: Colors.white,
      child: Column(
        children: [
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: options.length,
              itemBuilder: (context, index) {
                return _OptionPill(
                  label: options[index]['label'] as String,
                  icon: options[index]['icon'] as IconData,
                  onTap: () => _handleSend(options[index]['label'] as String),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xCCF8FAFC),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0x0D000000)),
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.add, color: AppColors.slate600),
                  ),
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      maxLines: null,
                      decoration: const InputDecoration(
                        hintText: 'Whisper a question...',
                        hintStyle: TextStyle(color: AppColors.slate400),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  _SendButton(
                    onPressed: _handleSend,
                    enabled: true, // Simplified
                  ),
                  const SizedBox(width: 44),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class Message {
  final String text;
  final bool isAi;
  Message({required this.text, required this.isAi});
}

class _ShimmerTitle extends StatefulWidget {
  const _ShimmerTitle();

  @override
  State<_ShimmerTitle> createState() => _ShimmerTitleState();
}

class _ShimmerTitleState extends State<_ShimmerTitle> with SingleTickerProviderStateMixin {
  late AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController.unbounded(vsync: this)
      ..repeat(min: -0.5, max: 1.5, period: const Duration(seconds: 3));
  }

  @override
  void dispose() {
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _shimmerController,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              colors: const [Colors.transparent, Colors.white, Colors.transparent],
              stops: const [0, 0.5, 1],
              transform: _ShimmerGradientTransform(_shimmerController.value),
            ).createShader(bounds);
          },
          blendMode: BlendMode.srcATop,
          child: const Text(
            'Snap AI',
            style: TextStyle(
              fontFamily: 'Fraunces',
              fontSize: 25,
              fontWeight: FontWeight.bold,
              color: AppColors.charcoal,
              letterSpacing: -0.3,
            ),
          ),
        );
      },
    );
  }
}

class _ShimmerGradientTransform extends GradientTransform {
  final double progress;
  const _ShimmerGradientTransform(this.progress);

  @override
  Matrix4? transform(Size size, {TextDirection? textDirection}) {
    return Matrix4.translationValues(size.width * progress, 0, 0);
  }
}

class _OptionPill extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _OptionPill({required this.label, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 10),
      child: ActionChip(
        onPressed: onTap,
        label: Row(
          children: [
            Icon(icon, size: 14, color: AppColors.slate600),
            const SizedBox(width: 6),
            Text(label, style: const TextStyle(fontSize: 12, color: AppColors.slate600)),
          ],
        ),
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFFF1F5F9)),
        ),
      ),
    );
  }
}

class _SendButton extends StatelessWidget {
  final VoidCallback onPressed;
  final bool enabled;

  const _SendButton({required this.onPressed, required this.enabled});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: enabled ? AppColors.charcoal : const Color(0x0D0F172A),
        shape: BoxShape.circle,
      ),
      child: IconButton(
        onPressed: enabled ? onPressed : null,
        padding: EdgeInsets.zero,
        icon: Icon(
          Icons.arrow_upward,
          size: 20,
          color: enabled ? Colors.white : const Color(0x660F172A),
        ),
      ),
    );
  }
}
