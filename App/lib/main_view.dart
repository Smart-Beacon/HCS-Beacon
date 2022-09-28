import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:smart_beacon_customer_app/nav_bar.dart';
import 'package:platform_device_id/platform_device_id.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';
import 'dart:developer';

class MainView extends StatelessWidget {
  const MainView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
              fit: BoxFit.cover, image: AssetImage('assets/background.png'))),
      child: Scaffold(
          drawer: const NavBar(),
          appBar: AppBar(
            iconTheme: const IconThemeData(
              color: Color(0xff81a4ff),
            ),
            backgroundColor: Colors.white,
            elevation: 0.0,
          ),
          extendBodyBehindAppBar: true,
          backgroundColor: Colors.transparent,
          body: Center(
              child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const <Widget>[
              InOutButton(text: 'Open'),
              //InOutButton(text: 'Out')
            ],
          ))),
    );
  }
}

class InOutButton extends StatefulWidget {
  const InOutButton({Key? key, required this.text}) : super(key: key);
  final String text;
  @override
  State<InOutButton> createState() => _InOutButtonState();
}

class _InOutButtonState extends State<InOutButton> {

  void checkUser(result) {
    if (result == 200) {
      // 통신 완료
      showSnackBar(context, '인증 성공하였습니다. Door is open');
    } else if (result == 202) {
      showSnackBar(context, '방문 인증이 되지 않았습니다.');
    } else if (result == 204) {
      showSnackBar(context, '방문 시간이 일치하지 않습니다.');
    } else if (result == 400) {
      // doorId 등록 x
      showSnackBar(context, '해당 출입문에는 접근이 불가합니다.');
    } else if (result == 401) {
      // deviceId 일치 x
      showSnackBar(context, 'deviceId값이 잘못되었습니다.');
    } else if (result == 403) {
      // token 일치 x
      showSnackBar(context, '사용자 인증이 안되었습니다.');
    } else {
      log(result.toString());
      showSnackBar(context, '서버 오류');
    }
  }

  Future<int?> isOpen() async {
    try {
      String? deviceId = await PlatformDeviceId.getDeviceId;
      const storage = FlutterSecureStorage();
      String? token = await storage.read(key:'BeaconToken');
      String? doorId = '01';

      if(deviceId != "" && token != "" && doorId != ""){
        log("${deviceId.toString()}, ${token.toString()}, ${doorId.toString()}");        
        var dio = Dio();
        dio.options.headers['token'] = token;
        String url = "http://10.0.2.2:5000/user/opendoor";
        var res = await dio.post(url, data: {'doorId': doorId, 'deviceId': deviceId});
        return res.statusCode;
      }
      return 404;
      
    } catch (err) {
      showSnackBar(context, err.toString());
    }
    return null;
  }


  @override
  void initState() {
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      width: 150,
      height: 150,
      child: ElevatedButton(
        onPressed: () async {
          checkUser(await isOpen());
        },
        style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF4E7EFC),
            shape: const CircleBorder(),),
            // shape: RoundedRectangleBorder(
            //     borderRadius: BorderRadius.circular(30.0))),
        child: Text(
          widget.text,
          style: const TextStyle(fontSize: 50.0),
        ),
      ),
    );
  }
}
