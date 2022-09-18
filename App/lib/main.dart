import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/find_account_screen.dart';
import 'package:smart_beacon_customer_app/find_id_screen.dart';
import 'package:smart_beacon_customer_app/find_pw_screen.dart';
import 'package:smart_beacon_customer_app/login_screen.dart';
import 'package:smart_beacon_customer_app/main_view.dart';
import 'package:smart_beacon_customer_app/middle_screen.dart';
import 'package:smart_beacon_customer_app/register_screen.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';

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
        '/': (context) => const MiddleScreen(),
        '/login': (context) => const LoginScreen(),
        '/regist': (context) => const RegisterScreen(),
        '/account': (context) => const AccountFindingPage(),
        '/findId': (context) => const FindIdPage(),
        '/findPw': (context) => const FindPwPage(),
        '/main': (context) => const MainView(),
      },
    );
  }
}
