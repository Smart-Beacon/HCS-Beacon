import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/*
  < 스플래쉬 뷰 >
  - 어플이 실행되는 동안 몇초 동안 이미지를 띄워 어플에서 사용될 정보들을 수집한다.
*/

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  // 토큰 유무 확인하는 변수로 자동 로그인을 체크하기 위함이다.
  bool? isToken;

  /*
    < 스플래쉬 뷰가 실행될 때 실행되는 메소드 >
    - 토큰이 저장되어 있는지 체크하는 메소드 실행 한 후, 
      2초 동안 스플래쉬 뷰를 보여준 뒤, 페이지를 이동하는 메소드 실행
  */
  startTime() async {
    await checkToken();
    var duration = const Duration(seconds: 2);
    return Timer(duration, navigationPage);
  }

  /* 
    < FlutterSecureStorage 패키지를 사용하여 SecureStorage에 토큰이 있는지 체크하는 메소드 >
    - BeaconToken이라는 토큰이 저장되어 있으면 True를 저장이 안되어있으면 False를 isToken 변수에 저장 
  */
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

  /* 
    < 토큰 존재 유무를 파악한 뒤 메인 뷰 혹은 미들 뷰로 이동하는 메소드 >
    - 토큰의 역할은 자동 로그인의 역할이기에 isToken이 True이면 자동 로그인이 되어 main뷰로 이동
    - isToken이 False이면 로그인이 안되어있다고 판단하여 middle 뷰로 이동
  */
  void navigationPage() {
    if (isToken!) {
      Navigator.of(context).pushReplacementNamed('/main');
    } else {
      Navigator.of(context).pushReplacementNamed('/middle');
    }
  }

  @override
  void initState() {
    super.initState();
    startTime();
  }

  /*
    - assets폴더에 있는 splash.png를 사용하여 스플래쉬 뷰를 보여준다.
  */
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
              fit: BoxFit.cover, image: AssetImage('assets/splash.png'))),
    );
  }
}
