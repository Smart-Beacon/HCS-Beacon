import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:app/nav_bar.dart';
import 'package:app/snackbar.dart';
import 'package:flutter/services.dart';

import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


import 'dart:developer';


class MainView extends StatefulWidget {
  const MainView({super.key});

  @override
  State<MainView> createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  static const platform = MethodChannel('samples.flutter.dev/battery');
  String _state = '';

  Future<void> _initBeacon() async {
    String state;
    try {
      final String result = await platform.invokeMethod("initBeacon");
      state = result;
    } on PlatformException catch (e) {
      state = e.message.toString();
    }

    setState(() {
      _state = state;
    });
  }

  // Get battery level.
  Future<void> permissionBle() async {
    await [
      Permission.bluetooth,
      Permission.location,
      Permission.bluetoothConnect,
      Permission.bluetoothScan,
    ].request();
    _initBeacon();
  }
  @override
  void initState() {
    super.initState();
    permissionBle();
  }
  

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
  List<String> _beaconIds = [];
  List<String> _myDoorList = [];
  

  Future<void> _getBeaconId() async {
    String beaconId;
    List<String> beaconIds;
    try {
      beaconId = await platform.invokeMethod("getBeaconId");
      String result = beaconId.replaceAll(' ', '');
      beaconIds = result.substring(1,result.length-1).split(',');
    } on PlatformException catch (e) {
      beaconIds = [e.message.toString()];
    }

    setState(() {
      _beaconIds = beaconIds;
    });
  }

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

  Future<void> _getUserDoorList() async {
    try{
      const storage = FlutterSecureStorage();
      var accessToken = await storage.read(key: 'BeaconToken');
      var dio = Dio();
      dio.options.headers['token'] = accessToken;  
      String url = "${dotenv.env['SERVER_URL']!}/user/doorlist";
      final res = await dio.post(url);
      switch (res.statusCode) {
        case 200:
          var result  = res.toString().replaceAll(' ', '');
          setState(() {
            _myDoorList = result.substring(1,result.length-1).split(',');
          });
          break;
        default:
          checkUser("재로그인해주세요");
          break;
      }
      
    }catch(err){
      checkUser(err.toString());
    }
  }

  Future<String?> isOpen(filterBeacon) async {
    try {
      const storage = FlutterSecureStorage();
      String? token = await storage.read(key:'BeaconToken');
      List <String> doorIds = filterBeacon;
      //String? doorId = _beaconId;

      if(_deviceId != "" && token != "" && doorIds.isNotEmpty){
        log(doorIds.toString());        
        var dio = Dio();
        dio.options.headers['token'] = token;
        String url = "${dotenv.env['SERVER_URL']!}/user/opendoor";
        var res = await dio.post(url, data: {'doorIds': doorIds, 'deviceId': _deviceId});
        log(res.data);
        return res.data.toString();
      }
      return "서버 오류";
      
    } catch (err) {
      log(err.toString());
      return "어플 오류";
    }
  }

  Future<void> sendBeaconId() async {
    await _getBeaconId();
    List<String> filterBeacon = _myDoorList.where((element){
      return _beaconIds.contains(element);
    }
    ).toList();
    //print(filterBeacon);
    if(filterBeacon.isNotEmpty){
        var result = await isOpen(filterBeacon);
        checkUser(result);
    }
  }
  
  void checkUser(result) {
      showSnackBar(context, result);
  }

  @override
  void initState() {
    super.initState();
    _getUserDoorList();
    //_getBeaconId();
    _getDeviceId();
    Timer.periodic(const Duration(seconds: 6), (timer) {
      sendBeaconId();  
    });
  }

  //@override
  // Widget build(BuildContext context) {
  //   return Container(
  //     margin: const EdgeInsets.all(20),
  //     width: 150,
  //     height: 150,
  //     child: ElevatedButton(
  //       onPressed: () async {
  //          await _getBeaconId();
  //       },
  //       style: ElevatedButton.styleFrom(
  //           backgroundColor: const Color(0xFF4E7EFC),
  //           shape: const CircleBorder(),),
  //       child: Text(
  //         widget.text,
  //         style: const TextStyle(fontSize: 40.0),
  //       ),
  //     ),
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(50),
      width: 150,
      height: 150,
      child: Image.asset('assets/logo.png'),
    );
  }
}
