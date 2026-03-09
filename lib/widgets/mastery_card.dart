import 'package:flutter/material.dart';
import '../models/study_story.dart';
import '../core/theme.dart';

class MasteryCard extends StatefulWidget {
  final ExamQuestion question;

  const MasteryCard({super.key, required this.question});

  @override
  State<MasteryCard> createState() => _MasteryCardState();
}

class _MasteryCardState extends State<MasteryCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _expanded = !_expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.slate100, width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _expanded ? AppColors.slate100 : const Color(0xFFF4F4F5),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    widget.question.type.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppColors.slate400,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                Icon(
                  _expanded ? Icons.expand_less : Icons.expand_more,
                  color: AppColors.slate400,
                  size: 20,
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              widget.question.question,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.charcoal,
                height: 1.5,
              ),
            ),
            if (_expanded) ...[
              const SizedBox(height: 16),
              const Divider(color: AppColors.slate100, thickness: 1.5),
              const SizedBox(height: 12),
              const Text(
                'ANSWER INSIGHTS',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.slate400,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.question.answer,
                style: const TextStyle(
                  fontSize: 16,
                  color: AppColors.slate600,
                  height: 1.5,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
