import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../core/theme.dart';

class ProcessingScreen extends StatefulWidget {
  final String imageUri;

  const ProcessingScreen({super.key, required this.imageUri});

  @override
  State<ProcessingScreen> createState() => _ProcessingScreenState();
}

class _ProcessingScreenState extends State<ProcessingScreen> {
  int _statusIndex = 0;
  late Timer _timer;

  final List<String> _statusMessages = [
    "Analyzing your notes...",
    "Extracting key concepts...",
    "Structuring explanation...",
    "Generating study highlights...",
    "Building your custom quiz...",
    "Finalizing study material..."
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (mounted) {
        setState(() {
          _statusIndex = (_statusIndex + 1) % _statusMessages.length;
        });
      }
    });

    // Simulate analysis completion
    Future.delayed(const Duration(seconds: 10), () {
      if (mounted) {
        context.replace('/results/mock'); // Using mock results path
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFF8FAFC), Color(0xFFEFF6FF)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildAnimationModule(),
                const SizedBox(height: 40),
                _buildTextSection(),
              ],
            ),
          ),
          _buildProgressBar(),
        ],
      ),
    );
  }

  Widget _buildAnimationModule() {
    return SizedBox(
      width: 200,
      height: 200,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Pulse Circle
          Container(
            width: 120,
            height: 120,
            decoration: const BoxDecoration(
              color: AppColors.electricBlue,
              shape: BoxShape.circle,
            ),
          ).animate(onPlay: (controller) => controller.repeat())
            .scale(begin: const Offset(1, 1), end: const Offset(1.5, 1.5), duration: 1000.ms, curve: Curves.easeOut)
            .fadeOut(duration: 1000.ms),
          
          // Logo Badge
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF2563EB), Color(0xFF3B82F6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(Icons.auto_awesome, size: 40, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildTextSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        children: [
          Text(
            _statusMessages[_statusIndex],
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.charcoal,
            ),
          ).animate(key: ValueKey(_statusIndex)).fadeIn(duration: 500.ms).slideY(begin: 0.1, end: 0),
          const SizedBox(height: 8),
          const Text(
            'Our AI is working its magic',
            style: TextStyle(
              fontSize: 16,
              color: AppColors.slate600,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressBar() {
    return Positioned(
      bottom: 100,
      left: 0,
      right: 0,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Container(
          height: 6,
          decoration: BoxDecoration(
            color: const Color(0xFFE2E8F0),
            borderRadius: BorderRadius.circular(3),
          ),
          child: Stack(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 500),
                width: MediaQuery.of(context).size.width * ((_statusIndex + 1) / _statusMessages.length),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
