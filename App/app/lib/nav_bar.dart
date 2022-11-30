import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/services.dart';

/*
  < 로그인 완료 후, 좌측 상단에 보이는 메뉴 바 >
  - 제품명을 보여준다.
  - 개발사 및 시스템 담당자를 보여준다.
  - 개인정보 확인 및 수정 뷰로 이동하는 버튼 존재
    > 해당 버튼 클릭 시, 개인정보 확인 및 수정 할 수 있는 뷰로 이동한다. 
  - 기기 정보 뷰로 이동하는 버튼 존재
    > 해당 버튼 클릭 시, 기기 정보를 확인할 수 있는 뷰로 이동한다.
  - 고객센터에 바로 전화할 수 있게 화면 전환해주는 버튼 존재
    > 해당 버튼 클릭 시, 고객센터 전화번호를 다이얼패드에 자동으로 입력해주어 바로 전화할 수 있게 한다.
  - 로그아웃 버튼 존재
    > 기기에 저장된 토큰을 삭제 후, middle 뷰로 이동한다.
*/

class NavBar extends StatelessWidget {
  const NavBar({Key? key}) : super(key: key);

  // Beacon SDK를 사용하기 위해 실행된 자바 코드의 결과를 가져오기 위한 메소드
  static const platform = MethodChannel('samples.flutter.dev/battery');

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          const UserAccountsDrawerHeader(
            accountName: Text('OPNC (Open&close)'),
            accountEmail: Text('< (주)명품 시스템  담당자: 김성환 >'),
            decoration: BoxDecoration(
              color: Color.fromARGB(255, 23, 20, 122),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.account_circle),
            title: const Text('개인정보 수정'),
            onTap: () {
              Navigator.pushNamed(context, '/editInfo');
            },
          ),
          ListTile(
            leading: const Icon(Icons.phonelink_setup),
            title: const Text('기기정보 확인'),
            onTap: () {
              Navigator.pushNamed(context, '/deviceInfo');
            },
          ),
          ListTile(
            leading: const Icon(Icons.dialpad),
            title: const Text('고객센터'),
            onTap: () {
              _makePhoneCall('tel:0426256785'); //고객센터 번호 넣기!!
            },
          ),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 23, 20, 122),
                ),
                child: const Text('로그아웃'),
                onPressed: () {
                  logOut();
                  Navigator.pushNamedAndRemoveUntil(
                      context, '/middle', (_) => false);
                }, // 로그아웃
              ))
        ],
      ),
    );
  }

  /*
    < 로그아웃 메소드 >
    - 로그아웃 버튼 클릭 시, 기기에 저장된 토큰을 삭제하며, Beacon 스캔을 멈춘다.
  */
  logOut() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: "BeaconToken");
    await platform.invokeMethod("stopScan");
  }

  /* 
    < 고객센터 전화번호 자동 입력 메소드 >
    - 고객센터 버튼 클릭 시, 미리 설정한 전화번호를 다이얼 패드에 입력해준다.
  */

  Future<void> _makePhoneCall(String callNum) async {
    final Uri url = Uri.parse(callNum);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
