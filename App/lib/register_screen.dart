import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:convert';
import 'package:time_picker_sheet/widget/sheet.dart';
import 'package:time_picker_sheet/widget/time_picker.dart';
import 'package:dio/dio.dart';
import 'package:smart_beacon_customer_app/snackbar.dart';
import 'dart:developer';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterDemoScreentate();
}

class _RegisterDemoScreentate extends State<RegisterScreen> {
  TextEditingController name = TextEditingController();
  TextEditingController phoneNum = TextEditingController();
  TextEditingController company = TextEditingController();
  TextEditingController position = TextEditingController();
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
    position.dispose();
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
                  padding: EdgeInsets.only(top: 60.0),
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
                    controller: position,
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
                const SelectBox(),
                RegisterButton(
                  name: name.text,
                  phoneNum: phoneNum.text,
                  company: company.text,
                  position: position.text,
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
    final newStartTime = await TimePicker.show(
        context: context,
        sheet: TimePickerSheet(
          sheetTitle: 'Enter Time',
          hourTitle: 'Hour',
          minuteTitle: 'Minute',
          saveButtonText: 'Select',
        ));
    if (newStartTime == null) return;
    setState(() => selectedStartTime = newStartTime);
  }

  Future pickEndTime(BuildContext context) async {
    final newEndTime = await TimePicker.show(
        context: context,
        sheet: TimePickerSheet(
          sheetTitle: 'Out Time',
          hourTitle: 'Hour',
          minuteTitle: 'Minute',
          saveButtonText: 'Select',
        ));
    if (newEndTime == null) return;
    setState(() => selectedEndTime = newEndTime);
  }
}

class RegisterButton extends StatefulWidget {
  const RegisterButton(
      {super.key,
      required this.name,
      required this.phoneNum,
      required this.company,
      required this.position,
      required this.reason,
      required this.selectedDate,
      required this.selectedStartTime,
      required this.selectedEndTime});

  final String? name;
  final String phoneNum;
  final String? company;
  final String? position;
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
      String url = "http://10.0.2.2:5000/user/register";
      var dio = Dio();
      var date = DateFormat('yyyy-MM-dd').format(widget.selectedDate!);
      var startTime = await getStringTime(widget.selectedStartTime!);
      var endTime = await getStringTime(widget.selectedEndTime!);
      String enterTime = '$date $startTime';
      String exitTime = '$date $endTime';
      var res = await dio.post(
        url,
        data: {
          'name': widget.name,
          'phoneNum': widget.phoneNum,
          'company': widget.company,
          'position': widget.position,
          'reason': widget.reason,
          'enterTime': enterTime,
          'exitTime': exitTime,
        },
      );
      switch (res.statusCode) {
        case 200:
        case 201:
          // ignore: use_build_context_synchronously
          showSnackBar(context, "등록이 완료되었습니다.");
          Future.delayed(const Duration(milliseconds: 3000),
              (() => Navigator.pushNamed(context, '/middle')));
          //onSuccess();
          break;
        case 400:
          //fail
          // ignore: use_build_context_synchronously
          showSnackBar(context, '통신이 원활하지 않습니다.');
          break;
      }
    } catch (err) {
      showSnackBar(context, err.toString());
    }
  }

  Future getStringTime(DateTime time) async {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}';
  }

  dynamic isEnterInfo() {
    String patttern = r'\d{3}-\d{4}-\d{4}';
    RegExp regExp = RegExp(patttern);

    if (widget.name == "") {
      showSnackBar(context, '이름을 기입해주세요.');
      return false;
    } else if (widget.phoneNum == "") {
      showSnackBar(context, '전화번호를 기입해주세요.');
      return false;
    } else if (!regExp.hasMatch(widget.phoneNum)) {
      showSnackBar(context, '올바른 형식의 전화번호를 기입해주세요.');
      return false;
    } else if (widget.company == "") {
      showSnackBar(context, '소속 혹은 회사를 기입해주세요.');
      return false;
    } else if (widget.position == "") {
      showSnackBar(context, '직책을 기입해주세요.');
      return false;
    } else if (widget.reason == "") {
      showSnackBar(context, '방문 사유를 입력해주세요.');
      return false;
    } else if (widget.selectedDate == null) {
      showSnackBar(context, '출입할 날짜를 선택해주세요.');
      return false;
    } else if (widget.selectedStartTime == null) {
      showSnackBar(context, '출입할 시간를 선택해주세요.');
      return false;
    } else if (widget.selectedEndTime == null) {
      showSnackBar(context, '출입할 시간를 선택해주세요.');
      return false;
    }
    return true;
  }

  dynamic compareTime() {
    final isCorrectTime =
        widget.selectedStartTime?.isBefore(widget.selectedEndTime!);
    if (isCorrectTime!) {
      return true;
    } else {
      showSnackBar(context, '출입시간이 올바르지 않습니다.');
      return false;
    }
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
          if (isEnterInfo() && compareTime()) {
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

class SelectBox extends StatefulWidget {
  const SelectBox({super.key});

  @override
  State<SelectBox> createState() => _SelectBoxState();
}

class _SelectBoxState extends State<SelectBox> {

  String? selectStaName;
  String? selectStaId;
  String? selectDoorId;
  String? selectDoorName;
  List<Statement>? statement;
  List<DoorInfo>? doorInfo;

  Future<void> getDoorInfo() async{
    var dio = Dio();
    String url = 'http://10.0.2.2:5000/statement/regist';
    var res = await dio.post(url);
    switch(res.statusCode){
      case 200:
          //String staInfo = jsonDecode(res.data.toString());
          // Map<String, dynamic> resultData = jsonDecode(res.data);
          //_statement = json.decode(res.data['staData'].toString());
          //log(res.data.toString());
          // log(res.data['staData'].toString());
          // log(res.data['doorData'].toString());
          //var rest = result['staData'] as List;
          // List data = jsonDecode(res.data)['staData'];
          //Event event = Event.fromJson(res.data);
          //List<Statement> ss = Statement.fromJson(resultData['staData']);
          //Map<String, dynamic> staDatas = jsonDecode(res.data.toString());
          //Map<String, dynamic> doorDatas = jsonDecode(staInfo['doorData'].toString());
          List tagObjsJson = res.data['staData'] as List;
          List tagObjsJson2 = res.data['doorData'] as List;
          log(tagObjsJson.toString());
          // log(tagObjsJson[0].toString());
          // log(tagObjsJson2[0]["doorId"].toString());

        setState(() {
          // statement = res.data['staData'].cast;
          // doorInfo = res.data['doorData'] as List;
          //log(doorInfo.toString());
          //_statement = json.decode(res.data['staData'].toString());
          //_statement = rest.map<Statement>((e) => Statement.fromJson(e)).toList();
          statement = tagObjsJson.map((tagJson) => Statement.fromJson(tagJson)).toList();
          doorInfo = tagObjsJson2.map((tagJson) => DoorInfo.fromJson(tagJson)).toList();
          log(statement![0].toString());
        });
        break;
      default:
        break;
    }

  }

  @override
  void initState() {
    super.initState();
    getDoorInfo();  //건물 API 가져오기
  }

  @override
  Widget build(BuildContext context) {
    return const SizedBox(
      // child: Row(
      //   children: <Widget>[
      //     DropdownButton<String>(
      //         hint: const Text('Select Statement'),
      //         value: statement![0].staName!, // 수정
      //         isDense: true,
      //         onChanged: ((value) {
      //           setState(() {
      //             selectStaId = value;
      //           });
      //         }),
      //         items: statement?.map<DropdownMenuItem<String>>((Statement value) {
      //           return DropdownMenuItem<String>(
      //             value: value.staName.toString(),
      //             child: Text(value.staName.toString()),
      //             );
      //         }).toList(),
      //        ),
      //   ]));
    );
  }
}

class Statement {
  final String? staId;
  final String? staName;

  Statement({this.staId, this.staName});

  factory Statement.fromJson(Map<String, dynamic> json) {
    return Statement(
        staId: json['staId'], staName: json['staName']);
  }
}

class DoorInfo {
  final String? staId;
  final String? doorId;
  final String? doorName;

  DoorInfo({this.staId, this.doorId, this.doorName});
  factory DoorInfo.fromJson(Map<String, dynamic> json) {
    return DoorInfo(
        staId: json['staId'], doorId: json['doorId'], doorName: json['doorName']);
  }
}

class Event{
  final List<Statement>? staDatas;
  final List<DoorInfo>? doorDatas;

  Event({this.doorDatas, this.staDatas});
  factory Event.fromJson(dynamic json) {
    var stas = json['staData'] as List;
    var doors = json['doorData'] as List;
    List<Statement> stateList = stas.map((i) => Statement.fromJson(i)).toList();
    List<DoorInfo> doorList = doors.map((i) => DoorInfo.fromJson(i)).toList();
    return Event(
        staDatas: stateList,//List<Statement>.from(json["staData"].map((x) => Statement.fromJson(x))),
        doorDatas: doorList//List<DoorInfo>.from(json["doorData"].map((x) => DoorInfo.fromJson(x))),
    );
  }
}