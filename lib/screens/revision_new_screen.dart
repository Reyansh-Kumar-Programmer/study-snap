import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';

class RevisionNewScreen extends StatefulWidget {
  const RevisionNewScreen({super.key});

  @override
  State<RevisionNewScreen> createState() => _RevisionNewScreenState();
}

class _RevisionNewScreenState extends State<RevisionNewScreen> {
  final TextEditingController _controller = TextEditingController();
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      setState(() {
        _hasText = _controller.text.trim().isNotEmpty;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleGenerate() {
    if (_controller.text.trim().isEmpty) return;
    final topic = _controller.text.trim();
    context.push('/revision/${Uri.encodeComponent(topic)}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildEditorialPrompt(),
                    const SizedBox(height: 40),
                    _buildEditorialInput(),
                    const SizedBox(height: 40),
                    _buildUploadModule(),
                    const SizedBox(height: 40),
                    _buildSuggestionsSection(),
                    const SizedBox(height: 60),
                  ],
                ),
              ),
            ),
            _buildActionSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back, color: AppColors.charcoal),
          ),
          const Text(
            'Revision',
            style: TextStyle(
              fontFamily: 'Fraunces', // Using Fraunces for Tiempos look
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(width: 44),
        ],
      ),
    );
  }

  Widget _buildEditorialPrompt() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'CREATE NEW',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppColors.electricBlue,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'What are we mastering today?',
          style: TextStyle(
            fontSize: 36,
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            height: 1.1,
            letterSpacing: -1,
          ),
        ),
      ],
    ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildEditorialInput() {
    return TextField(
      controller: _controller,
      style: TextStyle(
        fontSize: 42,
        fontWeight: FontWeight.bold,
        color: _hasText ? const Color(0xFF0F766E) : AppColors.charcoal,
        letterSpacing: -1.5,
      ),
      maxLines: null,
      decoration: const InputDecoration(
        hintText: 'Enter your topic...',
        hintStyle: TextStyle(color: Color(0xFFCBD5E1)),
        border: InputBorder.none,
      ),
      autofocus: true,
    ).animate().fadeIn(duration: 800.ms, delay: 200.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildUploadModule() {
    return InkWell(
      onTap: () {},
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFFF1F7FF),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFDCEBFF), width: 1.5),
        ),
        child: const Row(
          children: [
            _SquareIconBox(icon: Icons.document_text, color: AppColors.electricBlue),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Enrich with reference material',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppColors.charcoal,
                    ),
                  ),
                  Text(
                    'Upload PDF or text for better accuracy',
                    style: TextStyle(fontSize: 12, color: AppColors.slate600),
                  ),
                ],
              ),
            ),
            Icon(Icons.add, color: AppColors.electricBlue, size: 24),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 800.ms, delay: 400.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildSuggestionsSection() {
    final suggestions = ['Quantum Physics', 'Global History', 'Neuroscience', 'Web Design'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'QUICK START',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppColors.electricBlue,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: suggestions.map((item) => _SuggestionTag(
            label: item,
            onTap: () => _controller.text = item,
          )).toList(),
        ),
      ],
    ).animate().fadeIn(duration: 800.ms, delay: 600.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildActionSection() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: double.infinity,
            height: 64,
            child: ElevatedButton(
              onPressed: _hasText ? _handleGenerate : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.charcoal,
                foregroundColor: Colors.white,
                disabledBackgroundColor: const Color(0xFFF1F5F9),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(32),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Generate Revision Sheet',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: _hasText ? Colors.white : const Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Icon(
                    Icons.auto_awesome,
                    size: 18,
                    color: _hasText ? Colors.white : const Color(0xFF94A3B8),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            'AI will synthesize a full sheet based on your topic.',
            style: TextStyle(fontSize: 13, color: AppColors.slate400),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _SquareIconBox extends StatelessWidget {
  final IconData icon;
  final Color color;

  const _SquareIconBox({required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Icon(icon, size: 20, color: color),
    );
  }
}

class _SuggestionTag extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _SuggestionTag({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.5),
        ),
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
          ),
        ),
      ),
    );
  }
}
