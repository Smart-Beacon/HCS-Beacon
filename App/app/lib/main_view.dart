import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:app/nav_bar.dart';
import 'package:app/snackbar.dart';
import 'package:flutter/services.dart';

import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

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
  
  static const platform = MethodChannel('samples.flutter.dev/battery');

  String _deviceId = "";
  String _beaconID = "";

  Future<void> _getDeviceId() async{
    try{
      DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
      if (Platform.isAndroid) {
      AndroidDeviceInfo info = await deviceInfo.androidInfo;
      setState(() {
        _deviceId = info.id;
      });
    } else if (Platform.isIOS) {
      IosDeviceInfo info = await deviceInfo.iosInfo;
      setState(() {
        _deviceId = info.identifierForVendor!;
      });
    }
    }catch(err){
      checkUser(err.toString());
    } 
  }

  Future<void> _getBeaconUUID() async {
    String beaconID;
    try {
      final String result = await platform.invokeMethod('getBeaconId');
      checkUser(result);
      beaconID = 'Battery level at $result % .';
    } on PlatformException catch (e) {
      checkUser(e.message);
      beaconID = "Failed to get battery level: '${e.message}'.";
    }

    setState(() {
      _beaconID = beaconID;
    });
  }


  void checkUser(result) {
      showSnackBar(context, result);
  }


  Future<String?> isOpen() async {
    try {
      _getDeviceId();
      const storage = FlutterSecureStorage();
      String? token = await storage.read(key:'BeaconToken');
      String? doorId = '01';

      if(_deviceId != "" && token != "" && doorId != ""){
        log("${_deviceId.toString()}, ${token.toString()}, ${doorId.toString()}");        
        var dio = Dio();
        dio.options.headers['token'] = token;
        String url = "http://10.0.2.2:5000/user/opendoor";
        var res = await dio.post(url, data: {'doorId': doorId, 'deviceId': _deviceId});
        log(res.data);
        return res.data;
      }
      return "서버 오류";
      
    } catch (err) {
      log(err.toString());
      return "어플 오류";
    }
  }


  @override
  void initState() {
    super.initState();
    _getBeaconUUID();
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
