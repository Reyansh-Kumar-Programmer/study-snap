import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:markdown/markdown.dart' as md;

class MathMarkdown extends StatelessWidget {
  final String data;
  final TextStyle? style;

  const MathMarkdown({super.key, required this.data, this.style});

  @override
  Widget build(BuildContext context) {
    return MarkdownBody(
      data: data,
      selectable: true,
      shrinkWrap: true,
      styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)).copyWith(
        p: style ?? Theme.of(context).textTheme.bodyLarge,
        strong: const TextStyle(fontWeight: FontWeight.bold),
      ),
      builders: {
        'latex': LatexElementBuilder(),
      },
    );
  }
}

class LatexElementBuilder extends MarkdownElementBuilder {
  @override
  Widget visitElementAfter(md.Element element, TextStyle? preferredStyle) {
    final text = element.textContent;
    return Math.tex(
      text,
      textStyle: preferredStyle,
    );
  }
}
