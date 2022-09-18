import 'package:flutter/material.dart';

class FindPwPage extends StatelessWidget {
  const FindPwPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          image: DecorationImage(
        fit: BoxFit.cover,
        image: AssetImage('assets/background.png'),
      )),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Center(
          child: Column(
            children: <Widget>[
              Container(
                alignment: Alignment.center,
                margin: const EdgeInsets.only(top: 100),
                width: 250,
                height: 60,
                child: const Text(
                  '비밀번호 찾기',
                  style: TextStyle(
                    fontSize: 24.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Form(
                  child: Theme(
                      data: ThemeData(
                          primaryColor: const Color(0xFF4E7EFC),
                          inputDecorationTheme: const InputDecorationTheme(
                              labelStyle: TextStyle(
                            color: Color(0xFF4E7EFC),
                            fontSize: 15.0,
                          ))),
                      child: Column(
                        children: <Widget>[
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 60,
                            child: const TextField(
                              decoration: InputDecoration(labelText: '아이디 입력'),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 60,
                            child: const TextField(
                              decoration: InputDecoration(labelText: '이름 입력'),
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            width: 250,
                            height: 60,
                            child: const TextField(
                              decoration: InputDecoration(labelText: '전화번호 입력'),
                            ),
                          ),
                        ],
                      )))
            ],
          ),
        ),
      ),
    );
  }
}
