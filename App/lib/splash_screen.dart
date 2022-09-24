import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool? isToken;

  startTime() async {
    await checkToken();
    var duration = const Duration(seconds: 2);
    return Timer(duration, navigationPage);
  }

  Future<void> checkToken() async {
    const storage = FlutterSecureStorage();
    var token = await storage.read(key: 'BeaconToken');
    if (token != null) {
      setState(() {
        isToken = true;
      });
    } else {
      setState(() {
        isToken = false;
      });
    }
  }

  void navigationPage() {
    if (isToken!) {
      Navigator.of(context).pushReplacementNamed('/main');
      //Navigator.pushNamedAndRemoveUntil(context, '/main', (_) => false);
    } else {
      Navigator.of(context).pushReplacementNamed('/middle');
      //Navigator.pushNamedAndRemoveUntil(context, '/middle', (_) => false);
    }
  }

  @override
  void initState() {
    super.initState();
    startTime();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
              fit: BoxFit.cover, image: AssetImage('assets/splash.png'))),
    );
  }
}
