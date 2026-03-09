import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme.dart';
import 'screens/onboarding_screen.dart';
import 'screens/home_screen.dart';
import 'screens/revision_sheet_screen.dart';
import 'screens/revision_new_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/processing_screen.dart';
import 'screens/results/quiz_results_screen.dart';
import 'screens/results/explanation_screen.dart';
import 'screens/results/summary_screen.dart';
import 'screens/scan_screen.dart';

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/chat',
      builder: (context, state) => const ChatScreen(),
    ),
    GoRoute(
      path: '/scan',
      builder: (context, state) => const ScanScreen(),
    ),
    GoRoute(
      path: '/revision/new',
      builder: (context, state) => const RevisionNewScreen(),
    ),
    GoRoute(
      path: '/revision/:topic',
      builder: (context, state) {
        final topic = state.pathParameters['topic'] ?? 'Quantum Mechanics';
        return RevisionSheetScreen(topic: topic);
      },
    ),
    GoRoute(
      path: '/processing',
      builder: (context, state) {
        final uri = state.uri.queryParameters['uri'] ?? '';
        return ProcessingScreen(imageUri: uri);
      },
    ),
    GoRoute(
      path: '/results/quiz/:id',
      builder: (context, state) => QuizResultsScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/results/explanation/:id',
      builder: (context, state) => ExplanationScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/results/summary/:id',
      builder: (context, state) => SummaryScreen(id: state.pathParameters['id']!),
    ),
    // Fallback/Legacy result route
    GoRoute(
      path: '/results/:id',
      builder: (context, state) => SummaryScreen(id: state.pathParameters['id']!),
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'StudySnap AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: _router,
    );
  }
}
