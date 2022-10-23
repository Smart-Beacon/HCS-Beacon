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
    Map<Permission, PermissionStatus> statuses = await [
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
  String _beaconId = "";

  Future<void> _getBeaconId() async {
    String beaconId;
    try {
      final String result = await platform.invokeMethod("getBeaconId");
      beaconId = result;
    } on PlatformException catch (e) {
      beaconId = e.message.toString();
    }

    setState(() {
      _beaconId = beaconId;
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


  void checkUser(result) {
      showSnackBar(context, result);
  }


  Future<String?> isOpen() async {
    try {
      //_getDeviceId();
      const storage = FlutterSecureStorage();
      String? token = await storage.read(key:'BeaconToken');
      //String? doorId = '01';
      String? doorId = _beaconId;

      if(_deviceId != "" && token != "" && doorId != ""){
        log("${_deviceId.toString()}, ${token.toString()}, ${doorId.toString()}");        
        var dio = Dio();
        dio.options.headers['token'] = token;
        
        //String url = "http://10.0.2.2:5000/user/opendoor";
        String url = "${dotenv.env['SERVER_URL']!}/user/opendoor";
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
    _getBeaconId();
    _getDeviceId();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      width: 150,
      height: 150,
      child: ElevatedButton(
        onPressed: () async {
          _getBeaconId();
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
