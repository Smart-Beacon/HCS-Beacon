import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:app/snackbar.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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

  void checkUser(result) {
      showSnackBar(context, result.toString());
  }

  bool isEmptyPassword(){
    if(password.text == ''){
      return true;
    }else{
      return false;
    }
  }

  Future<String?> changePassword() async{
    try{
      String url = "${dotenv.env['SERVER_URL']!}/user/changepassword";
      var dio = Dio();
      var data = {
        "userLoginId": userLoginId,
        "password": password.text,
        
      };
      final res = await dio.post(url,data:data);
      return res.data;
    }catch(err){
      showSnackBar(context, err.toString());
    }
    return "서버 에러";
  }

  @override
  initState() {
    super.initState();
    _getUserInfo();
  }

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
        child:Container(
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
                          labelStyle: TextStyle(color: Colors.black, fontSize: 13.0),
                          hintText: 'Enter your password'),
                    ),
              ),
              const SizedBox(width: 10.0),
              Container(
                margin:const EdgeInsets.only(right:35.0),
                child: ElevatedButton(
                  onPressed: () async{
                  if(isEmptyPassword()){
                    checkUser("패스워드를 입력해주세요.");
                  }else{
                    checkUser(await changePassword());          
                    Future.delayed(const Duration(milliseconds: 3000),
                    (() => Navigator.pushNamed(context, '/main')));
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xff81a4ff),
                  padding: const EdgeInsets.all(7.0),
                  textStyle: const TextStyle(color: Colors.black),
                ),child: const Text("패스워드 변경"),),
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
