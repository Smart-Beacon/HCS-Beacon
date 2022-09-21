import 'package:flutter/material.dart';

class FindIdPage extends StatelessWidget {
  const FindIdPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
            fit: BoxFit.cover,
            image: AssetImage('assets/background.png'),
          )
      ),
      child: Scaffold(
        appBar: AppBar(
          iconTheme: const IconThemeData(
            color: Color(0xff81a4ff), //색변경
          ),
          backgroundColor: Colors.white,
          elevation: 0.0,
        ),
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(
            children: <Widget>[
              Container(
                alignment: Alignment.center,
                margin: const EdgeInsets.only(top: 100),
                width: 250,
                height: 60,
                child: const Text('아이디 찾기',
                  style: TextStyle(
                      fontSize: 24.0,
                      fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Form(
                  child: Theme(
                      data: ThemeData(
                        primaryColor: const Color(0xff81a4ff),
                        inputDecorationTheme: const InputDecorationTheme(
                          labelStyle: TextStyle(
                            color: Color(0xff81a4ff),
                            fontSize: 15.0,
                          )
                        )
                      ),
                      child: Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 60,
                            child: const TextField(
                              decoration: InputDecoration(
                                labelText: '이름 입력'
                              ),
                            ),
                          ),

                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 60,
                            child: const TextField(
                              decoration: InputDecoration(
                                  labelText: '전화번호 입력'
                              ),
                            ),
                          ),
                        ],
                      )
                  )
              )
            ],
          ),
        ),
      ),
    );
  }
}
