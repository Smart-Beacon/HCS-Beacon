import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/findAccount_screen.dart';
import 'package:smart_beacon_customer_app/findId_screen.dart';
import 'package:smart_beacon_customer_app/findPw_screen.dart';
import 'package:smart_beacon_customer_app/login_screen.dart';
import 'package:smart_beacon_customer_app/middle_screen.dart';
import 'package:smart_beacon_customer_app/register_screen.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:smart_beacon_customer_app/main_view.dart';

void main() {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  runApp(const MyApp());
  FlutterNativeSplash.remove();
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        // '/': (context) => const MiddleScreen(),
        '/': (context) => const MainView(),
        '/login': (context) => const LoginScreen(),
        '/regist': (context) => const RegisterScreen(),
        '/account': (context) => const AccountFindingPage(),
        '/findId': (context) => const FindIdPage(),
        '/findPw': (context) => const FindPwPage()
      },
    );
  }
}
