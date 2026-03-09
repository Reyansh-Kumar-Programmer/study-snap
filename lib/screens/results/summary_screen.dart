import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class SummaryScreen extends StatelessWidget {
  final String id;
  const SummaryScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFFFFBEB), Color(0xFFFEF3C7), Colors.white],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                    child: Column(
                      children: [
                        _buildIconCircle(),
                        const SizedBox(height: 24),
                        const Text(
                          'Topic Overview',
                          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.charcoal),
                        ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0),
                        const SizedBox(height: 8),
                        Text(
                          'Scanned on ${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}',
                          style: const TextStyle(fontSize: 15, color: AppColors.slate600, fontWeight: FontWeight.w500),
                        ).animate().fadeIn(duration: 400.ms, delay: 100.ms),
                        const SizedBox(height: 32),
                        _buildSummaryCard(),
                        const SizedBox(height: 60),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _CircleHeaderBtn(icon: Icons.close, onTap: () => context.pop()),
          const Text('Quick Summary', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal)),
          _CircleHeaderBtn(icon: Icons.share_outlined, onTap: () {}),
        ],
      ),
    );
  }

  Widget _buildIconCircle() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [Color(0xFFFDE68A), Color(0xFFD97706)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD97706).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: const Icon(Icons.bolt, size: 32, color: Colors.white),
    ).animate().fadeIn().scale();
  }

  Widget _buildSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFFEF3C7)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF64748B).withOpacity(0.08),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: const Stack(
        children: [
          Align(
            alignment: Alignment.topLeft,
            child: Icon(Icons.format_quote, color: Color(0x33D97706), size: 32),
          ),
          Padding(
            padding: EdgeInsets.symmetric(vertical: 20, horizontal: 8),
            child: Text(
              "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions. Chemical energy produced by the mitochondria is stored in a small molecule called adenosine triphosphate (ATP). Mitochondria contain their own small chromosomes.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 17, height: 1.6, color: AppColors.charcoal, fontWeight: FontWeight.w500),
            ),
          ),
          Align(
            alignment: Alignment.bottomRight,
            child: Icon(Icons.format_quote, color: Color(0x33D97706), size: 32),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.1, end: 0);
  }
}

class _CircleHeaderBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _CircleHeaderBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2)),
          ],
        ),
        child: Icon(icon, size: 24, color: AppColors.charcoal),
      ),
    );
  }
}
