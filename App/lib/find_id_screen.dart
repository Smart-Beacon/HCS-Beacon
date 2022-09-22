import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';

class FindIdScreen extends StatefulWidget {
  const FindIdScreen({Key? key}) : super(key: key);

  @override
  State<FindIdScreen> createState() => _FindIdScreenState();
}

class _FindIdScreenState extends State<FindIdScreen> {
  TextEditingController userName = TextEditingController();
  TextEditingController userPhone = TextEditingController();
  TextEditingController token = TextEditingController();

  String? userId;
  String? userRealName;
  String? userLoginId;

  Future<int?> isUserExist(BuildContext context) async {
    try {
      var dio = Dio();
      String url = "http://10.0.2.2:5000/user/check/id";
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

  void checkUser(result) {
    if (result == 200) {
      showSnackBar(context, '인증번호가 발송되었습니다.');
    } else {
      showSnackBar(context, '해당 ID는 존재하지 않습니다');
    }
  }

  Future<int?> verifyUser() async {
    try {
      var dio = Dio();
      String url = "http://10.0.2.2:5000/user/find/id";
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

  dynamic isPageMove(context, result) {
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
                                            isPageMove(
                                                context, await verifyUser());
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
                    child: const Text('확인', style: TextStyle(fontSize: 20)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xff81a4ff),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10.0)),
                    )))
          ]),
        ),
      ),
    );
  }
}

class ScreenArguments {
  final String userName;
  final String userLoginId;

  ScreenArguments(this.userName, this.userLoginId);
}


// class FindIdResultScreen extends StatelessWidget {
//   const FindIdResultScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final args = ModalRoute.of(context)!.settings.arguments as ScreenArguments;
//     return Container(
//       decoration: const BoxDecoration(
//           image: DecorationImage(
//         fit: BoxFit.cover,
//         image: AssetImage('assets/background.png'),
//       )),
//       child: Scaffold(
//         extendBodyBehindAppBar: true,
//         backgroundColor: Colors.transparent,
//         body: Center(
//           child: Column(children: <Widget>[
//             const SizedBox(height: 200),
//             Text(
//               '${args.userName} 님의 아이디는',
//               style: const TextStyle(fontSize: 24),
//             ),
//             const SizedBox(height: 50),
//             Text(
//               '${args.userLoginId} 입니다.',
//               style: const TextStyle(fontSize: 24),
//             ),
//             const SizedBox(height: 200),
//             SizedBox(
//                 width: 100,
//                 height: 50,
//                 child: ElevatedButton(
//                     onPressed: () {
//                       Navigator.pop(context);
//                       Navigator.pop(context);
//                       Navigator.pop(context);
//                     },
//                     child: const Text('확인', style: TextStyle(fontSize: 20)),
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: const Color(0xff81a4ff),
//                       shape: RoundedRectangleBorder(
//                           borderRadius: BorderRadius.circular(10.0)),
//                     )))
//           ]),
//         ),
//       ),
//     );
//   }
// }

// class ScreenArguments {
//   final String userName;
//   final String userLoginId;

//   ScreenArguments(this.userName, this.userLoginId);
// }
