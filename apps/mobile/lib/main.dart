import 'package:flutter/material.dart';

void main() {
  runApp(const FocusFlowApp());
}

class FocusFlowApp extends StatelessWidget {
  const FocusFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FocusFlow',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
      ),
      home: const ModeSwitcher(),
    );
  }
}

class ModeSwitcher extends StatefulWidget {
  const ModeSwitcher({super.key});

  @override
  State<ModeSwitcher> createState() => _ModeSwitcherState();
}

class _ModeSwitcherState extends State<ModeSwitcher> {
  bool workMode = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FocusFlow'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              workMode ? 'Work Space' : 'Life Space',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Text(
              workMode
                  ? 'Organize deep work blocks, tasks, and Proof-of-Focus summaries.'
                  : 'Coordinate family rituals, shared lists, and restorative breaks.',
            ),
            const Spacer(),
            SegmentedButton<bool>(
              segments: const [
                ButtonSegment(value: true, label: Text('Work')),
                ButtonSegment(value: false, label: Text('Life')),
              ],
              selected: {workMode},
              onSelectionChanged: (selection) {
                setState(() {
                  workMode = selection.first;
                });
              },
            )
          ],
        ),
      ),
    );
  }
}
