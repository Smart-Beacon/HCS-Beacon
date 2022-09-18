import 'package:flutter/material.dart';
//import 'package:smart_beacon_customer_app/device_info_check.dart';
//import 'package:smart_beacon_customer_app/edit_personal_info.dart';

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
              //_callNumber();
            },
          ),
          SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                child: const Text('로그아웃'),
                onPressed: () {}, // 로그아웃
              ))
        ],
      ),
    );
  }

  // _callNumber() async {
  //   await FlutterPhoneDirectCaller.callNumber("12345678");
  // }

  // Future<void> _makePhoneCall(String url) async {
  //   try {
  //     if (await canLaunch(url)) {
  //       await launch(url);
  //     } else {
  //       throw 'Could not launch $url';
  //     }
  //   } catch (err) {
  //     err.toString();
  //   }
  // }
}
