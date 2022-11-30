import 'package:flutter/material.dart';

/*
  < 로그인 버튼과 방문 신청 버튼이 있는 뷰 >
  - 로그인 뷰로 이동할지, 아니면 방문 신청 뷰로 이동할지 선택하는 중간 뷰
*/

class MiddleScreen extends StatefulWidget {
  const MiddleScreen({super.key});

  @override
  State<MiddleScreen> createState() => _MiddleScreenState();
}

class _MiddleScreenState extends State<MiddleScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.all(50),
        decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage('assets/background.png'), fit: BoxFit.cover)),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: const <Widget>[
              LoginButton(),
              RegisterButton(),
            ],
          ),
        ),
      ),
    );
  }
}

/*
  < 로그인 뷰로 이동하는 버튼 >
  - 해당 버튼 클릭 시, 로그인 뷰( /login )로 이동한다.
*/
class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 0.0),
      height: 50,
      width: 250,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          backgroundColor: const Color(0xff81a4ff),
        ),
        onPressed: () {
          Navigator.pushNamed(context, '/login');
        },
        child: const Text(
          '로그인',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}

/*
  < 방문 신청 뷰로 이동하는 버튼 >
  - 해당 버튼 클릭 시, 방문 신청 뷰( /regist )로 이동한다.
  - 즉, 방문자가 건물에 출입하기 위해 정보를 입력하여 등록하는 뷰이다.
*/

class RegisterButton extends StatelessWidget {
  const RegisterButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 0.0),
      height: 50,
      width: 250,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          backgroundColor: const Color(0xff81a4ff),
        ),
        onPressed: () {
          Navigator.pushNamed(context, '/regist');
        },
        child: const Text(
          '방문 신청',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}
