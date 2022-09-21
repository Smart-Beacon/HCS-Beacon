import 'package:flutter/material.dart';

class DeviceInfoCheck extends StatelessWidget{
  const DeviceInfoCheck({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context){
    return Container(
      decoration: const BoxDecoration(
          image:DecorationImage(
              fit: BoxFit.cover,
              image: AssetImage('assets/background.png'))
      ),
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
      ),
    );
  }
}