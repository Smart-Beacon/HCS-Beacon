import 'package:flutter/material.dart';
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

class DeviceInfoCheck extends StatefulWidget {
  const DeviceInfoCheck({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _DeviceInfoCheckState createState() => _DeviceInfoCheckState();
}

class _DeviceInfoCheckState extends State<DeviceInfoCheck> {

  String _deviceId = '';

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
      return;
    } 
  }

  @override
  initState() {
    super.initState();
    _getDeviceId();
    // Add listeners to this class
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
