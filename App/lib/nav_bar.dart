import 'package:flutter/material.dart';

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
            onTap: () {},
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
}
