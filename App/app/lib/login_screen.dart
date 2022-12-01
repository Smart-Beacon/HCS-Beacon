import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:app/snackbar.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

/*
  < 메인 뷰로 이동하기 위한 로그인 뷰 >
  - 사용자의 아이디 및 비밀번호를 입력하는 필드 존재
  - 사용자의 계정을 찾는 것을 도와주는 페이지로 이동하는 버튼 존재
*/

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController userId = TextEditingController();
  TextEditingController userPw = TextEditingController();
  String? _deviceId = '';

  /*
    < 디바이스 고유 ID를 가져오는 메소드 >
    - 안드로이드 및 ios 운영체제에 따라 나눠 다른 디바이스 ID를 가져온다.
    - 해당 디바이스 Id를 변수에 저장한다.
  */
  Future<void> _getDeviceId() async {
    try {
      DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
      if (Platform.isAndroid) {
        AndroidDeviceInfo info = await deviceInfo.androidInfo;
        setState(() {
          _deviceId = info.id;
        });
      } else if (Platform.isIOS) {
        IosDeviceInfo info = await deviceInfo.iosInfo;
        setState(() {
          _deviceId = info.identifierForVendor!;
        });
      }
    } catch (err) {
      return;
    }
  }

  /*
    < 로그인 하는 메소드 >
    - 사용자가 입력한 로그인 Id와 패스워드, 해당 디바이스 Id를 API서버로 전송한다.
    - 사용자의 정보가 일치 하며, 최초 로그인 시 최초 로그인한 디바이스Id 를 DB에 저장 후, 서버로부터 토큰을 받는다.
    - 해당 토큰을 기기에 저장한 다음 main 뷰로 이동.
    - 사용자의 정보가 일치 하며, 최초 로그인이 아닐 경우, 저장된 디바이스Id와 전송한 디바이스 ID의 일치 여부를 체크
    - 만일 일치 할 경우, 서버로부터 토큰을 받고 기기에 저장한 다음 main 뷰로 이동.
    - 만일 일치 하지 않을 경우, 다른 사람이 로그인한 것으로 간주하여 오류 메시지를 띄운다.
  */
  Future<void> callAPI(BuildContext context) async {
    try {
      //await _getDeviceId();
      var dio = Dio();
      String url = "${dotenv.env['SERVER_URL']!}/auth/user/login";
      var res = await dio.post(url, data: {
        'userId': userId.text,
        'userPw': userPw.text,
        'venderId': _deviceId
      });
      switch (res.statusCode) {
        case 200:
          // 1. 정보저장(토큰 저장 할거야?? 토큰 활용할거지?)
          saveToken(res.data['token']);
          // 2. 페이지 이동
          // ignore: use_build_context_synchronously
          Navigator.pushNamedAndRemoveUntil(context, '/main', (_) => false);
          //onSuccess();
          break;
        case 202:
          //fail
          // ignore: use_build_context_synchronously
          showSnackBar(context, '등록되지 않은 유저입니다.');
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  /*
    < 서버로부터 받은 토큰을 저장하는 메소드 >
    - flutterSecureStorage 플러그인을 사용하여 안전하게 기기에 토큰을 저장
    - 해당 토큰을 key-value 형태로 저장
  */
  void saveToken(jwt) async {
    const storage = FlutterSecureStorage();
    String token = jwt;
    await storage.write(key: "BeaconToken", value: token);
  }

  /*
    < 아이디 및 패스워드가 빈칸인지 체크하는 메소드 >
    - 아이디 및 패스워드가 하나라도 빈칸일 경우 오류메시지를 띄우며, False를 반환
  */

  dynamic isEnterInfo() {
    if (userId.text.isEmpty) {
      showSnackBar(context, '아이디를 입력해주세요.');
      return false;
    }
    if (userPw.text.isEmpty) {
      showSnackBar(context, '패스워드를 입력해주세요.');
      return false;
    }
    return true;
  }

  /*
    < 해당 뷰가 시작될 때 처음 실행되는 메소드 >
    - 현재 기기의 디바이스ID를 가져와 저장하는 메소드를 실행한다.
  */
  @override
  void initState() {
    super.initState();
    _getDeviceId();
  }

  @override
  void dispose() {
    userId.dispose();
    userPw.dispose();
    super.dispose();
  }

  /*
    < 메인 뷰로 이동하기 위한 로그인 뷰 >
    - 사용자의 아이디 및 비밀번호를 입력하는 필드 존재
    - 사용자가 기입한 정보를 API서버로 보내주는 버튼 존재(로그인 버튼)
    - 사용자의 계정을 찾는 것을 도와주는 페이지로 이동하는 버튼 존재
  */
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: Color(0xff81a4ff), //색변경
        ),
        backgroundColor: Colors.white,
        elevation: 0.0,
        //title: const Text("Login Page"),
      ),
      extendBodyBehindAppBar: true,
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.all(32),
          decoration: const BoxDecoration(
              image: DecorationImage(
                  image: AssetImage('assets/background.png'),
                  fit: BoxFit.cover)),
          child: SingleChildScrollView(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: TextField(
                    controller: userId,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: '전화번호( - 없이 기입)',
                        hintText: 'Enter Your PhoneNum'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  //padding: EdgeInsets.symmetric(horizontal: 15),
                  child: TextField(
                    controller: userPw,
                    obscureText: true,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: '고유 패스워드',
                        hintText: 'Enter your verify code'),
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  //padding: EdgeInsets.symmetric(horizontal: 15),
                  child: Text(
                    "※ 고정 출입자는 아이디를 입력해주세요",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13.0,
                      color: Colors.grey,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 15.0),
                  height: 50,
                  width: 250,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20.0)),
                        backgroundColor: const Color(0xff81a4ff)),
                    onPressed: () async {
                      if (isEnterInfo()) {
                        await callAPI(context);
                      }
                    },
                    child: const Text(
                      '로그인',
                      style: TextStyle(color: Colors.white, fontSize: 24.0),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/account');
                  },
                  child: const Text(
                    '사용자 계정 찾기',
                    style: TextStyle(color: Color(0xff81a4ff), fontSize: 15),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
