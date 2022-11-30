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

/*
  < main 뷰 >
  - 화면에는 로고 이미지와 좌측에 메뉴바가 존재한다.
  - 블루투스 권한 허용 및 위치 권한 허용 요청을 해달라는 메소드가 실행된다.
  - 해당 뷰에서 자동으로 Beacon 통신을 한다.
  - BeaconId가 감지되면 해당 BeaconId와 자신이 들어갈 BeaconId가 일치하면 서버로 문을 열어달라고 요청한다.
*/

class MainView extends StatefulWidget {
  const MainView({super.key});

  @override
  State<MainView> createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  // Beacon SDK를 사용하기 위해 실행된 자바 코드의 결과를 가져오기 위한 메소드
  static const platform = MethodChannel('samples.flutter.dev/battery');
  String _state = '';

  /*
    < BeaconId를 스캔하기 위한 초기 설정 메소드>
    - BeaconId를 스캔하기 위한 초기 설정 메소드이다.
    - 현재 사용하고 있는 Beacon의 Sdk는 Java로 이루어져있기에 dart 파일에서는 동작이 되지 않음
    - Sdk를 안드로이드에서 자바로 돌리고 해당 결과를 플로터로 가져오는 역할이다.
  */
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

  /*
    < 블루투스 및 위치 권한 허용 요청 메소드 >
    - 블루투스 스캔, 연결 권한 허용을 요청한다.
    - 해당 기기의 위치 권한 허용을 요청한다.
    - BeaconId를 스캔하기 위해 초기 설정을 하는 메소드를 실행한다.
  */
  Future<void> permissionBle() async {
    await [
      Permission.bluetooth,
      Permission.location,
      Permission.bluetoothConnect,
      Permission.bluetoothScan,
    ].request();
    _initBeacon();
  }

  /* 
    < 해당 뷰에 들어왔을 때 실행되는 메소드 >
    - 권한 허용 요청 메소드를 실행한다.
  */
  @override
  void initState() {
    super.initState();
    permissionBle();
  }

  /*
    < 초기 화면 뷰 >
    - 백그라운드를 설정하고 가운데는 Logo이미지를 보여준다.
  */
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

/*
    < 로고 이미지를 보여주는 뷰 >
    - 로고 이미지를 보여준다.
    - 자동으로 Beacon 스캔의 결과를 가져와 서버로 전송해준다.
    - 서버로부터 응답을 받아 출입이 가능한지 메시지를 띄워준다.
  */
class InOutButton extends StatefulWidget {
  const InOutButton({Key? key, required this.text}) : super(key: key);
  final String text;
  @override
  State<InOutButton> createState() => _InOutButtonState();
}

class _InOutButtonState extends State<InOutButton> {
  // Beacon SDK를 사용하기 위해 실행된 자바 코드의 결과를 가져오기 위한 메소드
  static const platform = MethodChannel('samples.flutter.dev/battery');

  String _deviceId = "";
  List<String> _beaconIds = [];
  List<String> _myDoorList = [];

  /*
    < 백그라운드에서 실행되는 Java 코드를 통해 BeaconId를 가져오는 메소드 >
    - 백그라운드에서 실행되는 Java 코드를 통해 BeaconId를 문자열형태로 가져온다.
    - 문자열 형태의 결과물을 다시 String형태의 리스트로 변환한 후 저장한다.
  */
  Future<void> _getBeaconId() async {
    String beaconId;
    List<String> beaconIds;
    try {
      beaconId = await platform.invokeMethod("getBeaconId");
      String result = beaconId.replaceAll(' ', '');
      beaconIds = result.substring(1, result.length - 1).split(',');
    } on PlatformException catch (e) {
      beaconIds = [e.message.toString()];
    }

    setState(() {
      _beaconIds = beaconIds;
    });
  }

  /*
    < 디바이스 고유 ID를 가져오기 위한 메소드 >
    - DeviceInfoPlugin을 사용하여 안드로이드 혹은 ios 기기가 가지는 고유의 Id를 가져와 변수에 저장하는 메소드이다.
    - android와 ios를 나눠 기기의 고유Id를 가져온다.
  */
  Future<void> _getDeviceId() async {
    try {
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
    } catch (err) {
      checkUser(err.toString());
    }
  }

  /*
    < 유저가 출입 가능한 도어들의 정보를 가져오는 메소드 >
    - 토큰을 API서버로 보내 해당 유저가 출입 할 수 있는 BeaconId들을 받아온다.
    - 서버로부터 제대로 된 응답을 받게 될 경우, BeaconId들을 문자열 형태로 받는다.
    - 토큰 정보가 잘못되었거나, 만료되었거나 오류가 발생하였을 경우, 오류메시지를 띄워준다.
  */

  Future<void> _getUserDoorList() async {
    try {
      const storage = FlutterSecureStorage();
      var accessToken = await storage.read(key: 'BeaconToken');
      var dio = Dio();
      dio.options.headers['token'] = accessToken;
      String url = "${dotenv.env['SERVER_URL']!}/user/doorlist";
      final res = await dio.post(url);
      switch (res.statusCode) {
        case 200:
          var result = res.toString().replaceAll(' ', '');
          setState(() {
            _myDoorList = result.substring(1, result.length - 1).split(',');
          });
          break;
        default:
          checkUser("재로그인해주세요");
          break;
      }
    } catch (err) {
      checkUser(err.toString());
    }
  }

  /*
    < 출입문의 접근 허가를 요청하는 메소드 >
    - 사용자가 들어갈 수 있는 출입문의 BeaconId가 감지가 되었을 때, 해당 출입문을 열어달라고 요청한다.
    - 토큰, 디바이스 Id, 감지된 BeaconId들을 API 서버로 전송한다.
    - 서버로부터 제대로 응답이 이루어질 경우 해당 문이 열였다는 메시지를 띄워준다.
    - 전송한 정보가 잘못되었거나, 서버에서 오류가 발생하였을 경우 해당 오류 메시지를 띄워준다.
  */

  Future<String?> isOpen(filterBeacon) async {
    try {
      const storage = FlutterSecureStorage();
      String? token = await storage.read(key: 'BeaconToken');
      List<String> doorIds = filterBeacon;
      //String? doorId = _beaconId;

      if (_deviceId != "" && token != "" && doorIds.isNotEmpty) {
        log(doorIds.toString());
        var dio = Dio();
        dio.options.headers['token'] = token;
        String url = "${dotenv.env['SERVER_URL']!}/user/opendoor";
        var res = await dio
            .post(url, data: {'doorIds': doorIds, 'deviceId': _deviceId});
        log(res.data);
        return res.data.toString();
      }
      return "서버 오류";
    } catch (err) {
      log(err.toString());
      return "어플 오류";
    }
  }

  /*
    < BeaconId를 감지하여 서버로 해당 도어를 열어 달라고 요청하는 메소드 >
  */

  Future<void> sendBeaconId() async {
    await _getBeaconId();
    List<String> filterBeacon = _myDoorList.where((element) {
      return _beaconIds.contains(element);
    }).toList();
    //print(filterBeacon);
    if (filterBeacon.isNotEmpty) {
      var result = await isOpen(filterBeacon);
      checkUser(result);
    }
  }

  /*
    < 메시지를 띄워주는 메소드 >
    - 매개변수에 들어있는 메시지를 띄워준다.
  */
  void checkUser(result) {
    showSnackBar(context, result);
  }

  /*
    < 해당 뷰에 들어왔을 때 실행되는 메소드 >
    - 토큰을 통해 사용자가 들어갈 수 있는 출입문들을 서버로부터 받아오는 메소드 실행
    - 해당 기기의 디바이스 Id를 가져오는 메소드 실행
    - 6초마다 검색한 BeaconId들에서 사용자가 들어 갈 수 있는 도어가 있으면 서버에 전송하는 메소드 실행
  */

  @override
  void initState() {
    super.initState();
    _getUserDoorList();
    _getDeviceId();
    Timer.periodic(const Duration(seconds: 6), (timer) {
      sendBeaconId();
    });
  }

  /*
    < 처음 보이는 뷰 >
    - 로고 이미지를 보여준다.
  */
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
