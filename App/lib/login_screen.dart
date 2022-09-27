import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';
import 'package:platform_device_id/platform_device_id.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController userId = TextEditingController();
  TextEditingController userPw = TextEditingController();

  Future<void> callAPI(BuildContext context) async {
    try {
      String? venderId = await PlatformDeviceId.getDeviceId;
      var dio = Dio();
      String url = "http://10.0.2.2:5000/auth/user/login";
      var res = await dio.post(url, data: {
        'userId': userId.text,
        'userPw': userPw.text,
        'venderId': venderId
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
          showSnackBar(context, 'Unsigned User');
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  void saveToken(jwt) async {
    const storage = FlutterSecureStorage();
    String token = jwt;
    await storage.write(key: "BeaconToken", value: token);
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
                    onPressed: () async {
                      if (isEnterInfo()) {
                        await callAPI(context);
                      }
                    },
                    child: const Text(
                      'Login',
                      style: TextStyle(color: Colors.white, fontSize: 24.0),
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/account');
                  },
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