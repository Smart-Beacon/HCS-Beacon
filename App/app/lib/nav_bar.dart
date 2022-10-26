import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class NavBar extends StatelessWidget {
  const NavBar({Key? key}) : super(key: key);

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

  logOut() async {
    const storage = FlutterSecureStorage();
    await storage.delete(key: "BeaconToken");
  }

  Future<void> _makePhoneCall(String callNum) async {
    final Uri url = Uri.parse(callNum);
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
