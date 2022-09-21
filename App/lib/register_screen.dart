import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:time_picker_sheet/widget/sheet.dart';
import 'package:time_picker_sheet/widget/time_picker.dart';
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';
import 'package:dio/dio.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterDemoScreentate();
}

class _RegisterDemoScreentate extends State<RegisterScreen> {
  TextEditingController name = TextEditingController();
  TextEditingController phoneNum = TextEditingController();
  TextEditingController company = TextEditingController();
  TextEditingController depart = TextEditingController();
  TextEditingController reason = TextEditingController();
  DateTime? selectedDate;
  DateTime? selectedStartTime;
  DateTime? selectedEndTime;

  String getText() {
    if (selectedDate == null) {
      return '방문 일시';
    } else {
      return DateFormat('yyyy-MM-dd').format(selectedDate!);
    }
  }

  String getTime(time) {
    if (time == null) {
      return '입출 시간';
    } else {
      return '${time!.hour.toString().padLeft(2, '0')}:${time!.minute.toString().padLeft(2, '0')}';
    }
  }

  @override
  void dispose() {
    name.dispose();
    phoneNum.dispose();
    company.dispose();
    depart.dispose();
    reason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        iconTheme: const IconThemeData(
          color: Color(0xff81a4ff), //색변경
        ),
        backgroundColor: Colors.white,
        elevation: 0.0,
        //title: const Text("Login Page"),
      ),
      extendBodyBehindAppBar: true,
      body: GestureDetector(
        onTap: () {
          FocusScope.of(context).unfocus();
        },
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.all(32),
          decoration: const BoxDecoration(
              image: DecorationImage(
                  image: AssetImage('assets/background.png'),
                  fit: BoxFit.cover)),
          child: SingleChildScrollView(
            child: Column(
              children: <Widget>[
                const Padding(
                  padding: EdgeInsets.only(top: 15.0),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 0, bottom: 0),
                  child: TextField(
                    maxLines: 1,
                    controller: name,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '이름',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter your name'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  child: TextField(
                    controller: phoneNum,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '전화번호',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter your phoneNum'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  child: TextField(
                    controller: company,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '소속',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter your company'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  child: TextField(
                    controller: depart,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '직책',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter your department'),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  child: SizedBox(
                    height: 60,
                    width: 350,
                    child: TextButton.icon(
                      icon: const Icon(Icons.calendar_month,
                          size: 25, color: Colors.black),
                      style: TextButton.styleFrom(
                          alignment: Alignment.centerLeft,
                          foregroundColor: Colors.black,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(5.0),
                              side: const BorderSide(
                                  color: Colors.grey,
                                  width: 1.5,
                                  style: BorderStyle.solid))),
                      onPressed: () => pickDate(context),
                      label: Text(getText(),
                          style: const TextStyle(color: Colors.black)),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(
                      left: 15.0, right: 15.0, top: 15, bottom: 0),
                  child: TextField(
                    controller: reason,
                    maxLines: 3,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '방문사유',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter reason for visit'),
                  ),
                ),
                SizedBox(
                  child: Row(children: <Widget>[
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 15.0, right: 17.5, top: 15, bottom: 0),
                      child: SizedBox(
                        height: 60,
                        width: 140,
                        child: TextButton.icon(
                          icon: const Icon(Icons.schedule,
                              size: 25, color: Colors.black),
                          style: TextButton.styleFrom(
                              foregroundColor: Colors.black,
                              backgroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5.0),
                                  side: const BorderSide(
                                      color: Colors.grey,
                                      width: 1.5,
                                      style: BorderStyle.solid))),
                          onPressed: () => pickStartTime(context),
                          label: Text(getTime(selectedStartTime),
                              style: const TextStyle(color: Colors.black)),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 17.5, right: 15.0, top: 15, bottom: 0),
                      child: SizedBox(
                        height: 60,
                        width: 140,
                        child: TextButton.icon(
                          icon: const Icon(Icons.schedule,
                              size: 25, color: Colors.black),
                          style: TextButton.styleFrom(
                              foregroundColor: Colors.black,
                              backgroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5.0),
                                  side: const BorderSide(
                                      color: Colors.grey,
                                      width: 1.5,
                                      style: BorderStyle.solid))),
                          onPressed: () => pickEndTime(context),
                          label: Text(
                            getTime(selectedEndTime),
                            style: const TextStyle(color: Colors.black),
                          ),
                        ),
                      ),
                    ),
                  ]),
                ),
                RegisterButton(
                  name: name.text,
                  phoneNum: phoneNum.text,
                  company: company.text,
                  depart: depart.text,
                  reason: reason.text,
                  selectedDate: selectedDate,
                  selectedStartTime: selectedStartTime,
                  selectedEndTime: selectedEndTime,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future pickDate(BuildContext context) async {
    final initialDate = DateTime.now();
    final newDate = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? initialDate,
      firstDate: DateTime(DateTime.now().year),
      lastDate: DateTime(DateTime.now().year + 5),
    );
    if (newDate == null) return;

    setState(() => selectedDate = newDate);
  }

  Future pickStartTime(BuildContext context) async {
    final newTime = await TimePicker.show(
        context: context,
        sheet: TimePickerSheet(
          sheetTitle: 'Enter Time',
          hourTitle: 'Hour',
          minuteTitle: 'Minute',
          saveButtonText: 'Select',
        ));

    setState(() => selectedStartTime = newTime);
  }

  Future pickEndTime(BuildContext context) async {
    final newTime = await TimePicker.show(
        context: context,
        sheet: TimePickerSheet(
          sheetTitle: 'Out Time',
          hourTitle: 'Hour',
          minuteTitle: 'Minute',
          saveButtonText: 'Select',
        ));

    setState(() => selectedEndTime = newTime);
  }
}

class RegisterButton extends StatefulWidget {
  const RegisterButton(
      {super.key,
      required this.name,
      required this.phoneNum,
      required this.company,
      required this.depart,
      required this.reason,
      required this.selectedDate,
      required this.selectedStartTime,
      required this.selectedEndTime});

  final String? name;
  final String phoneNum;
  final String? company;
  final String? depart;
  final String? reason;
  final DateTime? selectedDate;
  final DateTime? selectedStartTime;
  final DateTime? selectedEndTime;

  @override
  State<RegisterButton> createState() => _RegisterButtonState();
}

class _RegisterButtonState extends State<RegisterButton> {
  Future callAPI(BuildContext context) async {
    try {
      var url = Uri.parse("주소");
      var dio = Dio();
      var res = await dio.post(
        "주소",
        data: jsonEncode({
          'name': widget.name,
          'phoneNum': widget.phoneNum,
          'company': widget.company,
          'depart': widget.depart,
          'reason': widget.reason,
          'enterDate': widget.selectedDate.toString(),
          'startTime': widget.selectedStartTime.toString(),
          'endTime': widget.selectedEndTime.toString()
        }),
      );
      switch (res.statusCode) {
        case 201:
          // 1. 저장 성공
          // 2. 페이지 이동
          // ignore: use_build_context_synchronously
          Navigator.pushNamed(context, '/loign');
          //onSuccess();
          break;
        case 400:
          //fail
          // ignore: use_build_context_synchronously
          showSnackBar(context, 'Unsigned User');
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  dynamic isEnterInfo() {
    String patttern = r'\d{3}-\d{4}-\d{4}';
    RegExp regExp = RegExp(patttern);

    if (widget.name == "") {
      showSnackBar(context, 'Enter your name');
      return false;
    } else if (widget.phoneNum == "") {
      showSnackBar(context, 'Enter your phone number');
      return false;
    } else if (!regExp.hasMatch(widget.phoneNum)) {
      showSnackBar(context, 'Please enter your phone number correctly');
      return false;
    } else if (widget.company == "") {
      showSnackBar(context, 'Enter your company');
      return false;
    } else if (widget.depart == "") {
      showSnackBar(context, 'Enter your depart');
      return false;
    } else if (widget.reason == "") {
      showSnackBar(context, 'Enter your reason of enter');
      return false;
    } else if (widget.selectedDate == null) {
      showSnackBar(context, 'Select enter date');
      return false;
    } else if (widget.selectedStartTime == null) {
      showSnackBar(context, 'Select enter time');
      return false;
    } else if (widget.selectedEndTime == null) {
      showSnackBar(context, 'Select out time');
      return false;
    }

    return true;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 30.0, bottom: 30.0),
      height: 50,
      width: 250,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
          backgroundColor: const Color(0xff81a4ff),
        ),
        onPressed: () {
          if (isEnterInfo()) {
            callAPI(context);
          }
        },
        child: const Text(
          'Register',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}

void showSnackBar(BuildContext context, String text) {
  showTopSnackBar(
      context,
      displayDuration: const Duration(milliseconds: 1000),
      CustomSnackBar.success(
          icon: const Icon(null),
          backgroundColor: const Color(0xff81a4ff),
          textStyle: const TextStyle(color: Colors.white),
          message: text));
}
