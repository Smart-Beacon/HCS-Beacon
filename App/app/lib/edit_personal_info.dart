import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:app/snackbar.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

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

  //TextEditingController changePW = TextEditingController();

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
      String url = "http://10.0.2.2:5000/user/changepassword";
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
      String url = "http://10.0.2.2:5000/user/info";
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
              Row(
                children: <Widget>[
                SizedBox(
                width: 200,
                child: TextField(
                      controller: password,
                      obscureText: true,
                      decoration: const InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: '변경할 패스워드',
                          labelStyle: TextStyle(color: Colors.black),
                          hintText: 'Enter your password'),
                    ),
              ),
              const SizedBox(width: 10.0),
              ElevatedButton(onPressed: ()async{
                if(isEmptyPassword()){
                  checkUser("패스워드를 입력해주세요.");
                }else{
                  checkUser(await changePassword());
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xff81a4ff),
                padding: const EdgeInsets.all(5.0),
                textStyle: const TextStyle(color: Colors.black),
              ),child: const Text("패스워드 변경"),),
                ],
              ),
              
              const SizedBox(height: 12.0),
              Text(
                "Phone Number : ${phoneNum!}",
                style: const TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
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
      ),
    );
  }
}
