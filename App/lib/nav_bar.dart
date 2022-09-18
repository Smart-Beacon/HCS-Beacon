import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/device_info_check.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:smart_beacon_customer_app/edit_personal_info.dart';

class NavBar extends StatelessWidget{
  const NavBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context){
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            accountName: Text('SMART BEACON'),
            accountEmail: Text('example@gmail.com'),
            decoration: BoxDecoration(
              color: Colors.blue,
            ),
          ),
          ListTile(
            leading: Icon(Icons.account_circle),
            title: Text('개인정보 수정'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => EditPersonalInfo())
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.phonelink_setup),
            title: Text('기기정보 확인'),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => DeviceInfoCheck())
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.dialpad),
            title: Text('고객센터'),
            onTap: () {
                  _makePhoneCall('tel:04212345678');
              },
          ),

          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              child: Text('로그아웃'),
              onPressed: () {}, // 로그아웃
            )
          )
        ],
      ),
    );
  }

  Future<void> _makePhoneCall(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
