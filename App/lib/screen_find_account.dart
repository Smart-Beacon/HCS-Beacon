import 'package:flutter/material.dart';

class AccountFindingPage extends StatelessWidget {
  const AccountFindingPage({Key? key}) : super(key: key);

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
            children: const <Widget>[FindIdButton(), FindPwButton()],
          ),
        ),
      ),
    );
  }
}

//아이디 찾기 버튼
class FindIdButton extends StatelessWidget {
  const FindIdButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 200),
      width: 250,
      height: 60,
      child: ElevatedButton(
        onPressed: () {
          Navigator.pushNamed(context, '/findId');
        },
        style: ElevatedButton.styleFrom(
          primary: const Color(0xFF4E7EFC),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
        ),
        child: const Text(
          '아이디 찾기',
          style: TextStyle(fontSize: 24.0),
        ),
      ),
    );
  }
}

// 패스워드 찾기 버튼
class FindPwButton extends StatelessWidget {
  const FindPwButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 20),
      width: 250,
      height: 60,
      child: ElevatedButton(
        onPressed: () {
          Navigator.pushNamed(context, '/findPw');
        },
        style: ElevatedButton.styleFrom(
          primary: const Color(0xFF4E7EFC),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
        ),
        child: const Text(
          '비밀번호 찾기',
          style: TextStyle(fontSize: 24.0),
        ),
      ),
    );
  }
}
