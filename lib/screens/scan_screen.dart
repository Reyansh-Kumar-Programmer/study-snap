import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _isFlashOn = false;

  void _onCapture() {
    // Navigate to processing with mock URI
    context.push('/processing?uri=mock_image_path');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Mock Camera Viewfinder
          Positioned.fill(
            child: Container(
              color: const Color(0xFF1E293B),
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.camera_alt, size: 64, color: Colors.white24),
                    SizedBox(height: 16),
                    Text(
                      'Camera Viewfinder',
                      style: TextStyle(color: Colors.white24, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Scan Frame / Overlay
          _buildScanFrame(),

          // Header Controls
          Positioned(
            top: MediaQuery.of(context).padding.top + 10,
            left: 20,
            right: 20,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _CircleControl(
                  icon: Icons.close,
                  onTap: () => context.pop(),
                ),
                _CircleControl(
                  icon: _isFlashOn ? Icons.flash_on : Icons.flash_off,
                  onTap: () => setState(() => _isFlashOn = !_isFlashOn),
                ),
              ],
            ),
          ),

          // Bottom Controls
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Column(
              children: [
                const Text(
                  'Center your notes in the frame',
                  style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),
                ).animate().fadeIn(),
                const SizedBox(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _CircleControl(
                      icon: Icons.photo_library,
                      size: 56,
                      iconSize: 24,
                      onTap: () {},
                    ),
                    _CaptureButton(onTap: _onCapture),
                    _CircleControl(
                      icon: Icons.history,
                      size: 56,
                      iconSize: 24,
                      onTap: () => context.push('/home'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScanFrame() {
    return Center(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.8,
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.white.withOpacity(0.5), width: 2),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Stack(
          children: [
            // Corner Accents
            ..._buildCorners(),
          ],
        ),
      ).animate(onPlay: (controller) => controller.repeat())
       .shimmer(duration: 2000.ms, color: Colors.white.withOpacity(0.1)),
    );
  }

  List<Widget> _buildCorners() {
    const double length = 30;
    const double thickness = 4;
    return [
      // Top Left
      Positioned(top: 0, left: 0, child: const _Corner(length: length, thickness: thickness, isTop: true, isLeft: true)),
      // Top Right
      Positioned(top: 0, right: 0, child: const _Corner(length: length, thickness: thickness, isTop: true, isLeft: false)),
      // Bottom Left
      Positioned(bottom: 0, left: 0, child: const _Corner(length: length, thickness: thickness, isTop: false, isLeft: true)),
      // Bottom Right
      Positioned(bottom: 0, right: 0, child: const _Corner(length: length, thickness: thickness, isTop: false, isLeft: false)),
    ];
  }
}

class _Corner extends StatelessWidget {
  final double length;
  final double thickness;
  final bool isTop;
  final bool isLeft;

  const _Corner({required this.length, required this.thickness, required this.isTop, required this.isLeft});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: length,
      height: length,
      decoration: BoxDecoration(
        border: Border(
          top: isTop ? BorderSide(color: Colors.white, width: thickness) : BorderSide.none,
          bottom: !isTop ? BorderSide(color: Colors.white, width: thickness) : BorderSide.none,
          left: isLeft ? BorderSide(color: Colors.white, width: thickness) : BorderSide.none,
          right: !isLeft ? BorderSide(color: Colors.white, width: thickness) : BorderSide.none,
        ),
      ),
    );
  }
}

class _CircleControl extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final double size;
  final double iconSize;

  const _CircleControl({required this.icon, required this.onTap, this.size = 44, this.iconSize = 24});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white, size: iconSize),
      ),
    );
  }
}

class _CaptureButton extends StatelessWidget {
  final VoidCallback onTap;
  const _CaptureButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80,
        height: 80,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 4),
        ),
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
}
