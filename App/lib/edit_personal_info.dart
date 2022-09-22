import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';

class EditPersonalInfo extends StatefulWidget {
  const EditPersonalInfo({super.key});

  @override
  State<EditPersonalInfo> createState() => _EditPersonalInfo();
}

class _EditPersonalInfo extends State<EditPersonalInfo> {
  String? userLoginId = "user";
  String? userName = "최재훈";
  String? company = "한남대학교";
  String? position = "학생";

  TextEditingController changePW = TextEditingController();

  @override
  initState() {
    super.initState();
    _getUserInfo();
  }

  Future<void> _getUserInfo() async {
    try {
      var dio = Dio();
      String url = "http://10.0.2.2:5000/user/info";
      final res = await dio.post(url, data: {'userId': 'userId'});
      switch (res.statusCode) {
        case 200:
          var user = res.toString();
          Map<String, dynamic> userInfo = jsonDecode(user);
          setState(() {
            userLoginId = userInfo["userLoginId"];
            userName = userInfo["userName"];
            company = userInfo["company"];
            position = userInfo["position"];
          });
          break;
        default:
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

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
        body: Container(
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Padding(padding: EdgeInsets.only(top: 60.0)),
              Text(
                "Name : ${userName!}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              const SizedBox(height: 12.0),
              Text(
                "ID : ${userLoginId!}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              const SizedBox(height: 12.0),
              Text(
                "PassWord : ${changePW.text}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              TextField(
                maxLines: 1,
                controller: changePW,
                decoration: const InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    // border: OutlineInputBorder(),
                    labelStyle: TextStyle(color: Colors.black),
                    hintText: 'change your new pw'),
              ),
              const SizedBox(height: 12.0),
              Text(
                "소속 : ${company!}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              const SizedBox(height: 12.0),
              Text(
                "직책 : ${position!}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              const SizedBox(height: 12.0),
            ],
          ),
        ),
      ),
    );
  }
}
