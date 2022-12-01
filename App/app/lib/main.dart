import 'package:flutter/material.dart';
import 'package:app/middle_screen.dart';
import 'package:app/splash_screen.dart';
import 'package:app/login_screen.dart';
import 'package:app/register_screen.dart';
import 'package:app/main_view.dart';
import 'package:app/find_id_screen.dart';
import 'package:app/find_pw_screen.dart';
import 'package:app/find_account_screen.dart';
import 'package:app/device_info_check.dart';
import 'package:app/edit_personal_info.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/*
  < main 메소드 >
  - 환경변수를 사용하기 위해 환경변수 메소드를 불러온다.
  - 어플을 실행하기 위해 runApp메소드를 사용한다.
*/
void main() async {
  await dotenv.load(fileName: 'assets/config/.env');
  runApp(const MyApp());
}

/*
  < MyApp 클래스 >
  - 라우터를 사용하여 사용자가 설정한 경로를 통해 지정한 페이지로 보다 편하게 이동한다.
  - /               ->  초기에 실행되는 스플래쉬 뷰이다.
  - /middle         ->  로그인 및 방문 신청을 선택 하는 중간 뷰이다.
  - /login          ->  로그인 및 사용자 계정 찾는 뷰이다.
  - /regist         ->  방문 신청을 하는 뷰이다.
  - /account        ->  사용자 계정을 찾는 뷰로 자세하게는 아이디 찾기, 패스워드 찾기를 선택하는 뷰이다.
  - /findId         ->  사용자의 이름, 전화번호를 입력하고 인증번호를 입력하는 뷰이다.
  - /findPw         ->  사용자의 이름, 전화번호, 로그인 아이디를 입력하고 인증번호를 입력하는 뷰이다.
  - /findIdResult   ->  사용자의 로그인 아이디를 보여주는 뷰이다.
  - /findPwResult   ->  사용자의 임시 패스워드를 보여주는 뷰이다.
  - /main           ->  로그인 후 보여지는 뷰이며, 블루투스 통신을 통해 BeaconId를 가져와 서버로 전송해주는 뷰이다.
  - /editInfo       ->  사용자 정보 확인 및 수정하는 뷰이다.
  - /deviceInfo     ->  해당 기기 정보 및 개발사, 어플리케이션 버전을 보여주는 뷰이다.
  
*/

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/middle': (context) => const MiddleScreen(),
        '/login': (context) => const LoginScreen(),
        '/regist': (context) => const RegisterScreen(),
        '/account': (context) => const AccountFindingPage(),
        '/findId': (context) => const FindIdScreen(),
        '/findPw': (context) => const FindPwScreen(),
        '/findIdResult': (context) => const FindIdResultScreen(),
        '/findPwResult': (context) => const FindPwResultScreen(),
        '/main': (context) => const MainView(),
        '/editInfo': (context) => const EditPersonalInfo(),
        '/deviceInfo': (context) => const DeviceInfoCheck(),
      },
    );
  }
}
