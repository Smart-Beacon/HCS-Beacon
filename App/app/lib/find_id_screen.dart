import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:app/snackbar.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/* 
  < 잊어버린 아이디를 찾기 위해 정보 및 인증번호를 입력하는 뷰 >
  - 아이디를 찾기 위해 사용자의 전화번호, 사용자의 이름을 기입한 후, API서버로 정보를 전송
  - 서버로부터 응답이 제대로 될 경우, 해당 사용자의 전화번호로 인증번호 전송
  - 서버로부터 응답이 제대로 안될 경우, 오류 메시지를 띄운다.
  - 인증번호 통과 후, 사용자의 아이디가 기입된 뷰로 바뀐다.
*/

class FindIdScreen extends StatefulWidget {
  const FindIdScreen({Key? key}) : super(key: key);

  @override
  State<FindIdScreen> createState() => _FindIdScreenState();
}

class _FindIdScreenState extends State<FindIdScreen> {
  TextEditingController userName = TextEditingController();
  TextEditingController userPhone = TextEditingController();
  TextEditingController token = TextEditingController(); // 입력한 인증번호

  String? userId;
  String? userRealName;
  String? userLoginId;

  /*
    < API서버에 정보를 전송하여 사용자가 존재하는지 체크하는 메소드 >
    - API서버에 사용자 이름, 사용자 전화번호를 전송하여 해당 사용자가 존재 할 경우
      사용자의 고유ID(userId)를 받고 해당 정보를 저장한다.
    - 해당 사용자가 존재하지 않을 경우 오류 메시지를 띄운다.
  */

  Future<int?> isUserExist(BuildContext context) async {
    try {
      var dio = Dio();
      String url = "${dotenv.env['SERVER_URL']!}/user/check/id";
      var res = await dio
          .post(url, data: {'name': userName.text, 'phoneNum': userPhone.text});
      switch (res.statusCode) {
        case 200:
          // userId 받음 (*로그인 ID 아님 인덱싱 ID임)
          setState(() {
            userId = res.data;
          });
          break;
        default:
          break;
      }
      return res.statusCode;
    } catch (err) {
      showSnackBar(context, err.toString());
    }
    return null;
  }

  /*
    < 메시지를 띄워주는 메소드 >
    - API서버의 응답 코드에 따라 다른 메시지를 띄워준다.
    - 사용자의 정보가 존재하여 올바른 응답을 받을 경우 인증번호가 발송되었다는 메시지를 띄운다.
    - 사용자의 정보가 존재하지 않는다는 응답을 받을 경우, 해당 유저는 존재하지 않는다는 메시지를 띄운다.
  */

  void checkUser(result) {
    if (result == 200) {
      showSnackBar(context, '인증번호가 발송되었습니다.');
    } else {
      showSnackBar(context, '해당 ID는 존재하지 않습니다');
    }
  }

  /*
    < 사용자가 입력한 인증번호가 맞는지 체크하는 메소드 >
    - 사용자가 입력한 인증번호와 API서버로 받은 userId를 서버로 전송하여 올바른 인증번호를 입력했는지 체크한다.
    - 올바른 인증번호를 기입했을 경우, 서버로부터 유저의 이름과 유저의 로그인ID를 받는다.
    - 올바른 인증번호를 기입하지 않을 경우, 서버로부터 오류 메시지를 받는다.
  */

  Future<int?> verifyUser() async {
    try {
      var dio = Dio();
      String url = "${dotenv.env['SERVER_URL']!}/user/find/id";
      final res =
          await dio.post(url, data: {'userId': userId, 'token': token.text});
      switch (res.statusCode) {
        case 200:
          var user = res.toString();
          Map<String, dynamic> userInfo = jsonDecode(user);
          setState(() {
            userRealName = userInfo["userName"];
            userLoginId = userInfo["userLoginId"];
          });
          break;
        default:
          break;
      }
      return res.statusCode;
    } catch (err) {
      showSnackBar(context, err.toString());
    }
    return null;
  }

  /*
    < API서버로부터 받은 결과를 메시지로 출력하는 메소드 >
    - 인증번호가 제대로 기입되었을 경우, 로그인 ID를 알려주는 페이지로 이동
    - 입력한 인증번호 시간이 초과 될 경우, "시간 초과" 메시지를 띄운다.
    - 입력한 인증번호가 틀렸을 시, "인증번호가 일치하지 않는다"는 메시지를 띄운다.
    - 그 외의 서버로 오류가 발생 했을 시, "에러" 메시지를 띄운다
  */
  dynamic isPageMove(result) {
    if (result == 200) {
      Navigator.pushNamed(context, '/findIdResult',
          arguments: ScreenArguments(userRealName!, userLoginId!));
    } else if (result == 204) {
      showSnackBar(context, "시간 초과");
    } else if (result == 205) {
      showSnackBar(context, "인증번호가 일치하지 않습니다.");
    } else {
      showSnackBar(context, "에러");
    }
  }

  /*
    < 사용자 정보를 기입했는지 체크하는 메소드 >
    - 사용자의 이름 칸과 사용자의 전화번호 칸이 비워져있는 경우를 체크한다.
    - 둘 중 하나라도 비워져있는 경우 False를 반환
  */
  dynamic isEnterInfo() {
    if (userName.text.isEmpty) {
      showSnackBar(context, '이름을 입력하세요');
      return false;
    }
    if (userPhone.text.isEmpty) {
      showSnackBar(context, '전화번호를 입력하세요');
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    userName.dispose();
    userPhone.dispose();
    token.dispose();
    super.dispose();
  }

  /*
    < 아이디를 찾기 위해 기입해야되는 정보를 보여주는 뷰 >
    - 사용자의 이름 및 사용자의 전화번호를 기입하는 부분 존재
    - 올바른 정보 기입 시, 인증번호 입력 칸 및 전송 버튼이 생긴다.
    - 올바른 인증번호 입력 시, 로그인ID를 보여주는 페이지로 이동한다.
  */

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
          body: GestureDetector(
            onTap: () {
              FocusScope.of(context).unfocus();
            },
            child: SingleChildScrollView(
              child: Center(
                child: Column(
                  children: <Widget>[
                    Container(
                      alignment: Alignment.center,
                      margin: const EdgeInsets.only(top: 100),
                      width: 250,
                      height: 60,
                      child: const Text(
                        '아이디 찾기',
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
                                inputDecorationTheme:
                                    const InputDecorationTheme(
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
                                  child: ElevatedButton(
                                    onPressed: () async {
                                      if (isEnterInfo()) {
                                        checkUser(await isUserExist(context));
                                      }
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xff81a4ff),
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(10.0)),
                                    ),
                                    child: const Text(
                                      '인증번호 전송',
                                      style: TextStyle(fontSize: 20.0),
                                    ),
                                  ),
                                ),
                                if (userId != null)
                                  Column(children: <Widget>[
                                    Container(
                                      margin: const EdgeInsets.only(top: 30),
                                      width: 250,
                                      height: 50,
                                      child: TextField(
                                        controller: token,
                                        decoration: const InputDecoration(
                                            border: OutlineInputBorder(),
                                            labelText: '인증번호',
                                            hintText: '6자리 코드 입력'),
                                      ),
                                    ),
                                    Container(
                                      margin: const EdgeInsets.only(top: 10),
                                      width: 250,
                                      height: 50,
                                      child: ElevatedButton(
                                        onPressed: () async {
                                          if (token.text.isEmpty) {
                                            showSnackBar(
                                                context, '인증번호를 입력하세요');
                                          } else {
                                            isPageMove(await verifyUser());
                                          }
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor:
                                              const Color(0xff81a4ff),
                                          shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(10.0)),
                                        ),
                                        child: const Text(
                                          '인증번호 확인',
                                          style: TextStyle(fontSize: 20.0),
                                        ),
                                      ),
                                    ),
                                  ])
                              ],
                            )))
                  ],
                ),
              ),
            ),
          ),
        ));
  }
}

/*
  < 올바른 정보 및 인증번호 기입 시 로그인 ID를 보여주는 뷰 >
  - 유저의 이름 및 로그인 ID를 보여주는 뷰이다.
  - 뷰를 변경하는 과정에서 매개변수로 넘겨받은 유저의 이름과 로그인ID를 가져와 보여준다.
*/
class FindIdResultScreen extends StatefulWidget {
  const FindIdResultScreen({super.key});

  @override
  State<FindIdResultScreen> createState() => _FindIdResultScreenState();
}

class _FindIdResultScreenState extends State<FindIdResultScreen> {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
        fit: BoxFit.cover,
        image: AssetImage('assets/background.png'),
      )),
      child: Scaffold(
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(children: <Widget>[
            const SizedBox(height: 200),
            Text(
              '${args.userName} 님의 아이디는',
              style: const TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 50),
            Text(
              '${args.userLoginId} 입니다.',
              style: const TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 200),
            SizedBox(
                width: 100,
                height: 50,
                child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.pop(context);
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff81a4ff),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0)),
                    ),
                    child: const Text('확인', style: TextStyle(fontSize: 20))))
          ]),
        ),
      ),
    );
  }
}

/* 
  < 다른 뷰로 변수들을 넘겨주기 위해 사용하는 클래스 >
  - 유저의 이름과 유저의 로그인ID를 넘겨주기 위한 클래스
*/

class ScreenArguments {
  final String userName;
  final String userLoginId;

  ScreenArguments(this.userName, this.userLoginId);
}
