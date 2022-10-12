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
            accountName: Text('SMART BEACON'),
            accountEmail: Text('example@gmail.com'),
            decoration: BoxDecoration(
              color: Colors.blue,
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
              _makePhoneCall('tel:04212345678'); //고객센터 번호 넣기!!
            },
          ),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
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
