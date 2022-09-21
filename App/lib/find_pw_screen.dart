import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';

class FindPwScreen extends StatefulWidget {
  const FindPwScreen({Key? key}) : super(key: key);

  @override
  State<FindPwScreen> createState() => _FindPwScreenState();
}

class _FindPwScreenState extends State<FindPwScreen> {
  TextEditingController userName = TextEditingController();
  TextEditingController userPhone = TextEditingController();
  TextEditingController userId = TextEditingController();

  dynamic isEnterInfo() {
    if (userName.text.isEmpty) {
      showSnackBar(context, '이름을 입력하세요');
      return false;
    }
    if (userPhone.text.isEmpty) {
      showSnackBar(context, '전화번호를 입력하세요');
      return false;
    }
    if (userId.text.isEmpty) {
      showSnackBar(context, '아이디를 입력하세요');
    }
    return true;
  }

  @override
  void dispose() {
    userName.dispose();
    userPhone.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
        fit: BoxFit.cover,
        image: AssetImage('assets/background.png'),
      )),
      child: Scaffold(
        appBar: AppBar(
          iconTheme: const IconThemeData(
            color: Color(0xff81a4ff), //색변경
          ),
          backgroundColor: Colors.white,
          elevation: 0.0,
        ),
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(
            children: <Widget>[
              Container(
                alignment: Alignment.center,
                margin: const EdgeInsets.only(top: 100),
                width: 250,
                height: 60,
                child: const Text(
                  '비밀번호 찾기',
                  style: TextStyle(
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Form(
                  child: Theme(
                      data: ThemeData(
                          primaryColor: const Color(0xff81a4ff),
                          inputDecorationTheme: const InputDecorationTheme(
                              labelStyle: TextStyle(
                            color: Color(0xff81a4ff),
                            fontSize: 15.0,
                          ))),
                      child: Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 50,
                            child: TextField(
                              controller: userName,
                              decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  labelText: '이름',
                                  hintText: '이름을 입력하세요'),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 50,
                            child: TextField(
                              controller: userPhone,
                              decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  labelText: '전화번호',
                                  hintText: '전화번호를 입력하세요'),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 50,
                            child: TextField(
                              controller: userId,
                              decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  labelText: '아이디',
                                  hintText: '아이디를 입력하세요'),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: () {
                                if (isEnterInfo()) {
                                  // 사용자 존재 유무 체크(없으면 사용자 없습니다 스낵바)
                                  // 존재하면 인증번호 전송 후 화면 넘어가기
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xff81a4ff),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10.0)),
                              ),
                              child: const Text(
                                '인증번호 전송',
                                style: TextStyle(fontSize: 20.0),
                              ),
                            ),
                          )
                        ],
                      )))
            ],
          ),
        ),
      ),
    );
  }
}
