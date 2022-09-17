import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController userId = TextEditingController();
  TextEditingController userPw = TextEditingController();

  void callAPI(BuildContext context) async {
    try {
      var url = Uri.parse("주소");
      http.Response res = await http.post(
        url,
        body: jsonEncode({'userId': userId.text, 'userPw': userPw.text}),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );
      switch (res.statusCode) {
        case 200:
          // 1. 정보저장
          // 2. 페이지 이동
          // ignore: use_build_context_synchronously
          Navigator.pushNamed(context, '/');
          //onSuccess();
          break;
        case 400:
          //fail
          // ignore: use_build_context_synchronously
          showSnackBar(context, 'Unsigned User');
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  dynamic isEnterInfo() {
    if (userId.text.isEmpty) {
      showSnackBar(context, 'Enter your ID');
      return false;
    }
    if (userPw.text.isEmpty) {
      showSnackBar(context, 'Enter your password');
      return false;
    }
    return true;
  }

  @override
  void dispose() {
    userId.dispose();
    userPw.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xff81a4ff),
        title: const Text("Login Page"),
      ),
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
                        labelText: 'ID',
                        hintText: 'Enter Your ID'),
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
                        labelText: 'Password',
                        hintText: 'Enter secure password'),
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
                    onPressed: () {
                      if (isEnterInfo()) {
                        callAPI(context);
                      }
                    },
                    child: const Text(
                      'Login',
                      style: TextStyle(color: Colors.white, fontSize: 24.0),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    'Forgot ID or Password',
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

void showSnackBar(BuildContext context, String text) {
  showTopSnackBar(
      context,
      displayDuration: const Duration(milliseconds: 1000),
      CustomSnackBar.success(
          icon: const Icon(null),
          backgroundColor: const Color(0xff81a4ff),
          textStyle: const TextStyle(color: Colors.white),
          message: text));
}
