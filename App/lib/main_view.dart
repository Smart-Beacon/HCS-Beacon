import 'package:flutter/material.dart';
import 'package:smart_beacon_customer_app/nav_bar.dart';

class MainView extends StatelessWidget {
  const MainView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        image:DecorationImage(
            fit: BoxFit.cover,
            image: AssetImage('assets/background.png'))
      ),
      child: Scaffold(
        drawer: NavBar(),
        appBar: AppBar(
          iconTheme: const IconThemeData(
            color: Color(0xff81a4ff),
          ),
          backgroundColor: Colors.white,
          elevation: 0.0,
        ),
        extendBodyBehindAppBar: true,
        backgroundColor: Colors.transparent,
        body: Center(
          child: Row(
            children: const <Widget>[InButton(), OutButton()],
          )
        )
      ),
    );
  }
}

// Enterace In Button
class InButton extends StatelessWidget{
  const InButton ({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      width: 150,
      height: 110,
      child: ElevatedButton(
        onPressed: (){
          // Door 통신part
        },
        style: ElevatedButton.styleFrom(
          primary: const Color(0xFF4E7EFC),
          shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0))
        ),
        child: const Text(
          'IN',
          style: TextStyle(fontSize:50.0),
        ),
      ),
    );
  }
}

// Enterance Out Button
class OutButton extends StatelessWidget{
  const OutButton ({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      width: 150,
      height: 110,
      child: ElevatedButton(
        onPressed: (){
          // Door 통신part
        },
        style: ElevatedButton.styleFrom(
            primary: const Color(0xFF4E7EFC),
            shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0))
        ),
        child: const Text(
          'Out',
          style: TextStyle(fontSize:50.0),
        ),
      ),
    );
  }
}