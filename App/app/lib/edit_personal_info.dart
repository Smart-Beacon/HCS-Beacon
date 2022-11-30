import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:app/snackbar.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/*
    < 사용자 정보 조회 및 변경하는 뷰 >
    - 디바이스에 저장되어 있는 토큰을 사용하여 API서버에 토큰을 보내 사용자의 정보를 받아온다.
*/

class EditPersonalInfo extends StatefulWidget {
  const EditPersonalInfo({super.key});

  @override
  State<EditPersonalInfo> createState() => _EditPersonalInfo();
}

class _EditPersonalInfo extends State<EditPersonalInfo> {
  TextEditingController password = TextEditingController();
  String? userLoginId = '';
  String? userName = '';
  String? company = '';
  String? position = '';
  String? phoneNum = '';

  /*
    < snackbar.dart 파일에 있는 메소드를 사용하여 알림창을 띄워주는 메소드 >
  */
  void checkUser(result) {
    showSnackBar(context, result.toString());
  }

  /*
    < 패스워드 입력 칸이 비워져 있는지 체크하는 메소드 >
    - 패스워드 입력 칸이 비워져 있을 경우 False를 채워져 있으면 True를 반환
  */
  bool isEmptyPassword() {
    if (password.text == '') {
      return true;
    } else {
      return false;
    }
  }

  /*
    < 패스워드를 변경하는 메소드 >
    - 입력된(변경할) 패스워드와 해당 유저의 ID를 API 서버로 전송하여 사용자의 패스워드를 변경하는 메소드이다.
    - 변경이 제대로 이루어지면 변경이 성공되었다는 메시지를 반환 아닐 경우 오류 메시지를 반환한다.
  */

  Future<String?> changePassword() async {
    try {
      String url = "${dotenv.env['SERVER_URL']!}/user/changepassword";
      var dio = Dio();
      var data = {
        "userLoginId": userLoginId,
        "password": password.text,
      };
      final res = await dio.post(url, data: data);
      return res.data;
    } catch (err) {
      showSnackBar(context, err.toString());
    }
    return "서버 에러";
  }

  /*
    < 해당 뷰에 들어왔을 때 실행되는 메소드 >
    - 사용자의 정보를 가져오는 메소드를 실행 한다.
  */

  @override
  initState() {
    super.initState();
    _getUserInfo();
  }

  /*
    < 사용자 정보를 API서버로부터 요청하는 메소드 >
    - 기기에 저장되어 있는 토큰을 통해 API서버에 사용자 정보를 요청한다.
    - 해당 토큰이 이상이 없으면 유저의 로그인 ID, 유저 이름, 소속 회사, 직책, 전화번호 정보를 보내준다.
    - 해당 토큰에 이상이 있으면 오류 메시지를 보낸다.
  */

  Future<void> _getUserInfo() async {
    try {
      const storage = FlutterSecureStorage();
      var accessToken = await storage.read(key: 'BeaconToken');
      var dio = Dio();
      dio.options.headers['token'] = accessToken;
      String url = "${dotenv.env['SERVER_URL']!}/user/info";
      final res = await dio.post(url);
      switch (res.statusCode) {
        case 200:
          var user = res.toString();
          Map<String, dynamic> userInfo = jsonDecode(user);
          setState(() {
            userLoginId = userInfo["userLoginId"];
            userName = userInfo["userName"];
            company = userInfo["company"];
            position = userInfo["position"];
            phoneNum = userInfo['phoneNum'];
          });
          break;
        default:
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  /*
    < 사용자 정보 확인 및 수정 하는 뷰 >
    - API서버로부터 받은 사용자 정보를 나열하여 보여주는 뷰이다.
    - 변경할 패스워드를 입력하는 TextField 및 API서버로 변경할 패스워드를 보내는 버튼이 존재한다.
    - 패스워드 변경이 성공했을 시, snackbar를 통해 성공 메시지를 띄워준 후 3초 후에 main 뷰로 이동한다.
    - 패스워드 변경이 실패했을 시, Snackbar를 통해 오류 메시지를 띄워준다.
  */

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
              fit: BoxFit.cover, image: AssetImage('assets/background.png'))),
      child: Scaffold(
        appBar: AppBar(
          iconTheme: const IconThemeData(
            color: Color(0xff81a4ff),
          ),
          backgroundColor: Colors.white,
          elevation: 0.0,
        ),
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.transparent,
        body: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
          },
          child: Container(
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const Padding(padding: EdgeInsets.only(top: 60.0)),
                Text(
                  " ○ 이름: ${userName!}",
                  style: const TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),
                Divider(
                  height: 5.0,
                  color: Colors.grey[850],
                  thickness: 0.5,
                  endIndent: 30.0,
                ),
                //const SizedBox(height: 12.0),
                Text(
                  " ○ 아이디 : ${userLoginId!}",
                  style: const TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: <Widget>[
                    SizedBox(
                      width: 170,
                      child: TextField(
                        controller: password,
                        obscureText: true,
                        decoration: const InputDecoration(
                            contentPadding: EdgeInsets.all(9),
                            isDense: true,
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(),
                            labelText: '변경할 패스워드',
                            labelStyle:
                                TextStyle(color: Colors.black, fontSize: 13.0),
                            hintText: 'Enter your password'),
                      ),
                    ),
                    const SizedBox(width: 10.0),
                    Container(
                      margin: const EdgeInsets.only(right: 35.0),
                      child: ElevatedButton(
                        onPressed: () async {
                          if (isEmptyPassword()) {
                            checkUser("패스워드를 입력해주세요.");
                          } else {
                            checkUser(await changePassword());
                            Future.delayed(const Duration(milliseconds: 3000),
                                (() => Navigator.pushNamed(context, '/main')));
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xff81a4ff),
                          padding: const EdgeInsets.all(7.0),
                          textStyle: const TextStyle(color: Colors.black),
                        ),
                        child: const Text("패스워드 변경"),
                      ),
                    ),
                  ],
                ),
                Divider(
                  height: 5.0,
                  color: Colors.grey[850],
                  thickness: 0.5,
                  endIndent: 30.0,
                ),
                Text(
                  " ○ 전화번호 : ${phoneNum!}",
                  style: const TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),
                Divider(
                  height: 5.0,
                  color: Colors.grey[850],
                  thickness: 0.5,
                  endIndent: 30.0,
                ),
                Text(
                  " ○ 소속 : ${company!}",
                  style: const TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),
                Divider(
                  height: 5.0,
                  color: Colors.grey[850],
                  thickness: 0.5,
                  endIndent: 30.0,
                ),
                Text(
                  " ○ 직책 : ${position!}",
                  style: const TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),

                Divider(
                  height: 5.0,
                  color: Colors.grey[850],
                  thickness: 0.5,
                  endIndent: 30.0,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
