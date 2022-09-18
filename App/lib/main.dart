import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/screen_find_account.dart';
import 'package:smart_beacon_customer_app/screen_find_id.dart';
import 'package:smart_beacon_customer_app/screen_find_pw.dart';
import 'package:smart_beacon_customer_app/main_view.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        // '/': (context) => const AccountFindingPage(),
        '/':(context) => const MainView(),
        '/findId': (context) => const FindIdPage(),
        '/findPw': (context) => const FindPwPage()
      },
    );
  }
}
