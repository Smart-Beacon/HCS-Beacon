import 'package:flutter/material.dart';
import 'package:platform_device_id/platform_device_id.dart';

class DeviceInfoCheck extends StatefulWidget {
  // const DeviceInfoCheck({super.key});
  const DeviceInfoCheck({Key? key}) : super(key: key);

  @override
  _DeviceInfoCheckState createState() => _DeviceInfoCheckState();

// @override
// State<DeviceInfoCheck> createState() => _DeviceInfoCheckState();
}

class _DeviceInfoCheckState extends State<DeviceInfoCheck> {
  // Map? _info;
  //
  // void _getInfo() async {
  //   // Instantiating the plugin
  //   final deviceInfoPlugin = DeviceInfoPlugin();
  //
  //   final result = await deviceInfoPlugin.deviceInfo;
  //   setState(() {
  //     print(_info);
  //     _info = result.toMap();
  //   });
  // }
  String? _id;

  @override
  initState() {
    super.initState();
    _getInfo();
    // Add listeners to this class
  }

  // This function will be called when the floating button is pressed
  void _getInfo() async {
    // Get device id
    String? result = await PlatformDeviceId.getDeviceId;

    // Update the UI
    setState(() {
      _id = result;
    });
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
                    offset: Offset(0, 5),
                  ),
                ]),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text("VENDOR ID",
                    style: TextStyle(
                      letterSpacing: 2.0,
                      fontWeight: FontWeight.bold,
                      fontSize: 42,
                      color: Colors.indigo,
                    )),
                SizedBox(height: 10.0),
                Text(_id ?? 'null',
                    style: TextStyle(
                      fontSize: 12,
                    )),
                SizedBox(height: 80.0),
                Text("BEACON VER.",
                    style: TextStyle(
                      letterSpacing: 1.0,
                      fontWeight: FontWeight.bold,
                      fontSize: 35,
                      color: Colors.indigo,
                    )),
                SizedBox(height: 10.0),
                Text("____SYSTEM USED BEACON VERSION____",
                    style: TextStyle(
                      fontSize: 12,
                    )),
                SizedBox(height: 80.0),
                Text("APPLICATION VER.",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 28,
                      color: Colors.indigo,
                    )),
                SizedBox(height: 10.0),
                Text("v 1.0.0.",
                    style: TextStyle(
                      fontSize: 12,
                    )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
