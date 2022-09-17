import 'package:beacon_test/login_screen.dart';
import 'package:beacon_test/middle_screen.dart';
import 'package:beacon_test/register_screen.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter/material.dart';

void main() {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  runApp(const MyApp());
  FlutterNativeSplash.remove();
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const MiddleScreen(),
        '/login': (context) => const LoginScreen(),
        '/regist': (context) => const RegisterScreen(),
      },
    );
  }
}
