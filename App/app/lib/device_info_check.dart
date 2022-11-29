import 'package:flutter/material.dart';
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

/*
  < 디바이스 정보를 알려주는 뷰 >
  - DeviceInfoPlugin을 사용하여 사용자의 디바이스 정보를 가져온다..
  - 사용자의 디바이스 정보, 개발사, 어플리케이션 버전을 알려주는 뷰
*/

class DeviceInfoCheck extends StatefulWidget {
  const DeviceInfoCheck({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _DeviceInfoCheckState createState() => _DeviceInfoCheckState();
}

class _DeviceInfoCheckState extends State<DeviceInfoCheck> {
  // 디바이스 마다 가지고 있는 고유 Id를 저장하기 위한 변수이다.
  String _deviceId = '';

  /*
    < 디바이스 고유 ID를 가져오기 위한 메소드 >
    - DeviceInfoPlugin을 사용하여 안드로이드 혹은 ios가 가지는 고유의 Id를 가져와 변수에 저장하는 메소드이다.
    - android와 ios를 나눠 고유Id를 가져온다.
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
      return;
    }
  }

  /*
    < 해당 뷰에 들어왔을 때 실행되는 메소드 >
    - 디바이스 정보를 가져오는 메소드를 실행 한다.
  */

  @override
  initState() {
    super.initState();
    _getDeviceId();
  }

  /*
    < 디바이스 정보 및 개발사, 어플리케이션 버전을 한눈에 보여주는 뷰 >
    - 배경 이미지를 가져와 보여주고 그 위에 디바이스 정보, 개발사, 어플리케이션 버전을 보여주는 뷰
  */

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
        body: Center(
          child: Container(
            width: MediaQuery.of(context).size.width * 0.90,
            height: MediaQuery.of(context).size.height * 0.75,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 5,
                    blurRadius: 7,
                    offset: const Offset(0, 5),
                  ),
                ]),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Text("디바이스 고유ID",
                    style: TextStyle(
                      letterSpacing: 2.0,
                      fontWeight: FontWeight.bold,
                      fontSize: 35,
                      color: Colors.indigo,
                    )),
                const SizedBox(height: 10.0),
                Text(_deviceId,
                    style: const TextStyle(
                      fontSize: 15,
                    )),
                const SizedBox(height: 80.0),
                const Text("개발사",
                    style: TextStyle(
                      letterSpacing: 1.0,
                      fontWeight: FontWeight.bold,
                      fontSize: 35,
                      color: Colors.indigo,
                    )),
                const SizedBox(height: 10.0),
                const Text("OPNC",
                    style: TextStyle(
                      fontSize: 15,
                    )),
                const Text("(주) 명품시스템",
                    style: TextStyle(
                      fontSize: 15,
                    )),
                const SizedBox(height: 80.0),
                const Text("어플리케이션 버전",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 35,
                      color: Colors.indigo,
                    )),
                const SizedBox(height: 10.0),
                const Text("V1.0.0",
                    style: TextStyle(
                      fontSize: 15,
                    )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
