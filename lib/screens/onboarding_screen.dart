import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';

class OnboardingData {
  final String title;
  final String description;
  final IconData icon;
  final List<Color> colors;

  const OnboardingData({
    required this.title,
    required this.description,
    required this.icon,
    required this.colors,
  });
}

const List<OnboardingData> onboardingItems = [
  OnboardingData(
    title: 'Scan your notes\ninstantly',
    description: 'Take a photo of handwritten or book notes and let AI do the rest',
    icon: Icons.camera_alt_outlined,
    colors: [Color(0xFF3B82F6), Color(0xFF2563EB), Color(0xFF1E40AF)],
  ),
  OnboardingData(
    title: 'AI explains\neverything',
    description: 'Understand any topic in seconds with clear, simple explanations',
    icon: Icons.psychology_outlined,
    colors: [Color(0xFF8B5CF6), Color(0xFF7C3AED), Color(0xFF5B21B6)],
  ),
  OnboardingData(
    title: 'Revise smarter\nwith AI',
    description: 'Get summaries and quizzes automatically generated from your notes',
    icon: Icons.auto_awesome_outlined,
    colors: [Color(0xFF06B6D4), Color(0xFF0891B2), Color(0xFF155E75)],
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _activeIndex = 0;

  void _handleContinue() {
    if (_activeIndex < onboardingItems.length - 1) {
      setState(() => _activeIndex++);
    } else {
      context.go('/home');
    }
  }

  void _handleSkip() {
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    final current = onboardingItems[_activeIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFFCFDFF),
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: _handleSkip,
                  child: const Text(
                    'Skip',
                    style: TextStyle(
                      color: AppColors.slate400,
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ),

            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Orbital Icon Section
                    SizedBox(
                      width: 220,
                      height: 220,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Orbital A
                          Container(
                            width: 210,
                            height: 210,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: current.colors.first.withOpacity(0.1),
                                width: 1,
                              ),
                            ),
                          ),
                          // Orbital B
                          Container(
                            width: 230,
                            height: 230,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: current.colors.first.withOpacity(0.05),
                                width: 1,
                              ),
                            ),
                          ),
                          // Main Icon
                          Container(
                            width: 170,
                            height: 170,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: current.colors,
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.8),
                                width: 4,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: current.colors.first.withOpacity(0.3),
                                  offset: const Offset(0, 25),
                                  blurRadius: 35,
                                  spreadRadius: -5,
                                ),
                              ],
                            ),
                            child: Icon(
                              current.icon,
                              size: 70,
                              color: Colors.white,
                            ),
                          ).animate(key: ValueKey(_activeIndex))
                            .fadeIn(duration: 600.ms)
                            .scale(delay: 100.ms),
                        ],
                      ),
                    ),

                    const SizedBox(height: 60),

                    // Text Content
                    Column(
                      children: [
                        Text(
                          current.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E40AF),
                            height: 1.2,
                          ),
                        ).animate(key: ValueKey('title-$_activeIndex'))
                          .fadeIn(duration: 500.ms)
                          .slideY(begin: 0.2, end: 0),
                        
                        const SizedBox(height: 16),
                        
                        Text(
                          current.description,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 16,
                            color: AppColors.slate600,
                            height: 1.5,
                          ),
                        ).animate(key: ValueKey('desc-$_activeIndex'))
                          .fadeIn(duration: 500.ms, delay: 200.ms)
                          .slideY(begin: 0.2, end: 0),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
              child: Column(
                children: [
                  // Pagination Dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      onboardingItems.length,
                      (index) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        height: 8,
                        width: index == _activeIndex ? 24 : 8,
                        decoration: BoxDecoration(
                          color: index == _activeIndex
                              ? AppColors.electricBlue
                              : const Color(0xFFE2E8F0),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(28),
                        gradient: const LinearGradient(
                          colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF2563EB).withOpacity(0.25),
                            offset: const Offset(0, 10),
                            blurRadius: 20,
                          ),
                        ],
                      ),
                      child: ElevatedButton(
                        onPressed: _handleContinue,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(28),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _activeIndex == onboardingItems.length - 1
                                  ? 'Get Started'
                                  : 'Continue',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.chevron_right, color: Colors.white),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
