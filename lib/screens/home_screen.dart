import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              _buildHeader(context),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    const SizedBox(height: 8),
                    _buildGreeting(),
                    const SizedBox(height: 24),
                    _buildBentoGrid(context),
                    const SizedBox(height: 24),
                    _buildRecentScansHeader(context),
                    const SizedBox(height: 14),
                    _buildEmptyScans(),
                    const SizedBox(height: 120), // Padding for FAB
                  ]),
                ),
              ),
            ],
          ),
          _buildFAB(context),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return SliverAppBar(
      backgroundColor: const Color(0xFFF8FAFC),
      floating: true,
      elevation: 0,
      automaticallyImplyLeading: false,
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppColors.electricBlue,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.description, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 8),
          const Text(
            'StudySnap',
            style: TextStyle(
              color: AppColors.electricBlue,
              fontWeight: FontWeight.bold,
              fontSize: 20,
              letterSpacing: -0.8,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          onPressed: () {},
          icon: const Icon(Icons.notifications_none, color: AppColors.charcoal),
        ),
        const SizedBox(width: 8),
        Padding(
          padding: const EdgeInsets.only(right: 20),
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.electricBlue,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: AppColors.electricBlue.withOpacity(0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(Icons.person_outline, color: Colors.white),
          ),
        ),
      ],
    );
  }

  Widget _buildGreeting() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)),
            const SizedBox(width: 6),
            Text(
              'Good morning'.toUpperCase(),
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.slate400,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        RichText(
          text: const TextSpan(
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
              letterSpacing: -1,
            ),
            children: [
              TextSpan(text: 'Ready to '),
              TextSpan(
                text: 'study',
                style: TextStyle(color: AppColors.electricBlue),
              ),
              TextSpan(text: '?'),
            ],
          ),
        ),
        const Text(
          "Let's turn your notes into knowledge",
          style: TextStyle(
            fontSize: 15,
            color: AppColors.slate600,
          ),
        ),
      ],
    ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildBentoGrid(BuildContext context) {
    return Column(
      children: [
        // AI Chat Card
        _BentoCard(
          title: 'Chat with AI',
          subtitle: 'Your intelligent study buddy',
          icon: Icons.auto_awesome,
          color: AppColors.electricBlue,
          onTap: () => context.push('/chat'),
        ),
        const SizedBox(height: 16),
        // Middle Row
        Row(
          children: [
            Expanded(
              child: _BentoTile(
                title: 'Scan',
                subtitle: 'Quick Solve',
                icon: Icons.qr_code_scanner,
                color: const Color(0xFF0EA5E9),
                onTap: () => context.push('/scan'),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _BentoTile(
                title: 'Revision',
                subtitle: 'AI Sheets',
                icon: Icons.layers_outlined,
                color: const Color(0xFFCA8A04),
                onTap: () => context.push('/revision/new'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        // Mock Test Card
        _BentoCardSmall(
          title: 'Prepare Mock Test',
          subtitle: 'Test your knowledge for the exams',
          icon: Icons.school_outlined,
          color: const Color(0xFF8B5CF6),
          onTap: () => context.push('/scan'),
        ),
      ],
    ).animate().fadeIn(duration: 600.ms, delay: 200.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildRecentScansHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Recent Scans',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            letterSpacing: -0.3,
          ),
        ),
        TextButton(
          onPressed: () {},
          child: const Text(
            'See all',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.electricBlue,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyScans() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 40),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.85),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.black.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          const Icon(Icons.cloud_upload_outlined, size: 48, color: Color(0xFFE2E8F0)),
          const SizedBox(height: 12),
          const Text(
            'No scans yet. Try scanning your notes!',
            style: TextStyle(color: AppColors.slate400),
          ),
        ],
      ),
    );
  }

  Widget _buildFAB(BuildContext context) {
    return Positioned(
      bottom: 24,
      left: 0,
      right: 0,
      child: Center(
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30),
            boxShadow: [
              BoxShadow(
                color: AppColors.electricBlue.withOpacity(0.3),
                blurRadius: 15,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: ElevatedButton(
            onPressed: () => context.push('/scan'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.electricBlue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
              elevation: 0,
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.camera_alt),
                SizedBox(width: 10),
                Text(
                  'Scan Notes',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                SizedBox(width: 10),
                Icon(Icons.auto_awesome, size: 16),
              ],
            ),
          ).animate().fadeIn(duration: 600.ms, delay: 600.ms).slideY(begin: 0.5, end: 0),
        ),
      ),
    );
  }
}

class _BentoCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _BentoCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Container(
        height: 110,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.85),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.black.withOpacity(0.05)),
        ),
        child: Stack(
          children: [
            Positioned.fill(
              child: Opacity(
                opacity: 0.15,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      colors: [color, Colors.transparent],
                      center: Alignment.topLeft,
                      radius: 1.5,
                    ),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(icon, size: 26, color: color),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 19,
                            fontWeight: FontWeight.bold,
                            color: AppColors.charcoal,
                            letterSpacing: -0.5,
                          ),
                        ),
                        Text(
                          subtitle,
                          style: const TextStyle(
                            fontSize: 14.5,
                            color: AppColors.slate600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.chevron_right, color: color.withOpacity(0.5)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BentoTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _BentoTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Container(
        height: 148,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.85),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.black.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.08),
                borderRadius: BorderRadius.circular(18),
              ),
              child: Icon(icon, size: 26, color: color),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoal,
                letterSpacing: -0.2,
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 13.5,
                color: AppColors.slate600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BentoCardSmall extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _BentoCardSmall({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Container(
        height: 84,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.85),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: Colors.black.withOpacity(0.05)),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, size: 22, color: color),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                      color: AppColors.charcoal,
                      letterSpacing: -0.2,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.slate600,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: color.withOpacity(0.5)),
          ],
        ),
      ),
    );
  }
}
