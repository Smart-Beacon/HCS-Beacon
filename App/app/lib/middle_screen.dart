import 'package:flutter/material.dart';

// 테스트 하기 위함
import 'dart:async';
import 'package:flutter/services.dart';

class MiddleScreen extends StatelessWidget {
  const MiddleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.all(50),
        decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage('assets/background.png'), fit: BoxFit.cover)),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: const <Widget>[
              LoginButton(),
              RegisterButton(),
              BlueToothButton()
            ],
          ),
        ),
      ),
    );
  }
}

class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 0.0),
      height: 50,
      width: 250,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          backgroundColor: const Color(0xff81a4ff),
        ),
        onPressed: () {
          Navigator.pushNamed(context, '/login');
        },
        child: const Text(
          'Login',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}

class RegisterButton extends StatelessWidget {
  const RegisterButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 0.0),
      height: 50,
      width: 250,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          backgroundColor: const Color(0xff81a4ff),
        ),
        onPressed: () {
          Navigator.pushNamed(context, '/regist');
        },
        child: const Text(
          'Register',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}

class BlueToothButton extends StatefulWidget {
  const BlueToothButton({super.key});

  @override
  State<BlueToothButton> createState() => _BlueToothButtonState();
}

class _BlueToothButtonState extends State<BlueToothButton> {
  static const platform = MethodChannel('samples.flutter.dev/battery');
  // Get battery level.

  String _batteryLevel = 'Unknown battery level.';

  Future<void> _getBatteryLevel() async {
    String batteryLevel;
    try {
      final String result = await platform.invokeMethod('getBeaconId');
      batteryLevel = 'Battery level at $result % .';
    } on PlatformException catch (e) {
      batteryLevel = "Failed to get battery level: '${e.message}'.";
    }

    setState(() {
      _batteryLevel = batteryLevel;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton(
              onPressed: _getBatteryLevel,
              child: const Text('Get Battery Level'),
            ),
            Text(_batteryLevel),
          ],
        ),
      ),
    );
  }
}