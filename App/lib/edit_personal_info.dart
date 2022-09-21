import 'package:flutter/material.dart';

class EditPersonalInfo extends StatefulWidget{
  const EditPersonalInfo({super.key});

  @override
  State<EditPersonalInfo> createState() => _EditPersonalInfo();
}

class _EditPersonalInfo extends State<EditPersonalInfo>{
  static const String ID = "user";
  static const String PW = "abar423";
  static const String Name = "최재훈";
  static const String Inst = "한남대학교";
  static const String Rank = "학생";

  TextEditingController changePW = TextEditingController();

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
        body: Container(
          alignment: Alignment.centerLeft,
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              const Padding(padding: EdgeInsets.only(top:60.0)),
              Text(
                  "Name : ${Name}",
                  style: TextStyle(
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: Colors.indigo,
                  ),
                ),
              SizedBox(height: 12.0),
              Text(
                "ID : ${ID}",
                style: TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              SizedBox(height: 12.0),
              Text(
                "PassWord : ${changePW.text}",
                style: TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              TextField(
                maxLines: 1,
                controller: changePW,
                decoration: const InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    // border: OutlineInputBorder(),
                    labelStyle: TextStyle(color: Colors.black),
                    hintText: 'change your new pw'),
              ),
              SizedBox(height: 12.0),
              Text(
                "소속 : ${Inst}",
                style: TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              SizedBox(height: 12.0),
              Text(
                "직책 : ${Rank}",
                style: TextStyle(
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.indigo,
                ),
              ),
              SizedBox(height: 12.0),
            ],
          ),
        ),
      ),
    );
  }
}