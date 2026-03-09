import 'package:flutter/material.dart';
import 'dart:math';
import '../models/study_story.dart';
import '../core/theme.dart';

class FlashcardDeck extends StatefulWidget {
  final List<Flashcard> cards;

  const FlashcardDeck({super.key, required this.cards});

  @override
  State<FlashcardDeck> createState() => _FlashcardDeckState();
}

class _FlashcardDeckState extends State<FlashcardDeck> {
  final PageController _controller = PageController();
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          height: 400,
          child: PageView.builder(
            controller: _controller,
            itemCount: widget.cards.length,
            onPageChanged: (idx) => setState(() => _currentIndex = idx),
            itemBuilder: (context, index) {
              return FlashcardWidget(card: widget.cards[index]);
            },
          ),
        ),
        const SizedBox(height: 20),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              onPressed: _currentIndex > 0 
                ? () => _controller.previousPage(duration: const Duration(milliseconds: 300), curve: Curves.ease) 
                : null,
              icon: const Icon(Icons.arrow_back_ios),
            ),
            Text('${_currentIndex + 1} / ${widget.cards.length}'),
            IconButton(
              onPressed: _currentIndex < widget.cards.length - 1 
                ? () => _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.ease) 
                : null,
              icon: const Icon(Icons.arrow_forward_ios),
            ),
          ],
        ),
      ],
    );
  }
}

class FlashcardWidget extends StatefulWidget {
  final Flashcard card;

  const FlashcardWidget({super.key, required this.card});

  @override
  State<FlashcardWidget> createState() => _FlashcardWidgetState();
}

class _FlashcardWidgetState extends State<FlashcardWidget> {
  bool _showBack = false;

  void _flip() {
    setState(() => _showBack = !_showBack);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _flip,
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        transitionBuilder: (child, animation) {
          final rotate = Tween(begin: pi, end: 0.0).animate(animation);
          return AnimatedBuilder(
            animation: rotate,
            child: child,
            builder: (context, child) {
              final isBack = child!.key == const ValueKey(true);
              var tilt = ((animation.value - 0.5).abs() - 0.5) * 0.003;
              tilt *= isBack ? -1.0 : 1.0;
              return Transform(
                transform: Matrix4.rotationY(rotate.value)..setEntry(3, 0, tilt),
                alignment: Alignment.center,
                child: child,
              );
            },
          );
        },
        child: _showBack ? _buildBack() : _buildFront(),
      ),
    );
  }

  Widget _buildFront() {
    return Container(
      key: const ValueKey(false),
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.slate100, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text(
            widget.card.question,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppColors.charcoal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBack() {
    return Container(
      key: const ValueKey(true),
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.softBlue,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.electricBlue.withOpacity(0.2), width: 2),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Text(
            widget.card.answer,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18,
              color: AppColors.charcoal,
              height: 1.5,
            ),
          ),
        ),
      ),
    );
  }
}
