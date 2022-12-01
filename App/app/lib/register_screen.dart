import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:time_picker_sheet/widget/sheet.dart';
import 'package:time_picker_sheet/widget/time_picker.dart';
import 'package:dio/dio.dart';
import 'package:app/snackbar.dart';
import 'dart:developer';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/*
  < 방문 신청을 위해 사용자 정보를 기입해야되는 뷰 >
  - 사용자 방문 신청을 위해 여러 정보를 기입해야 된다.
  - 사용자 이름, 전화번호, 소속, 직책, 패스워드, 방문 사유를 기입해야한다.
  - 방문시간, 방문 일자, 출입할 건물 및 출입문을 선택해야한다.
  - 전부 올바르게 선택하였을 경우 방문 신청 버튼을 클릭 시, API서버로 해당 데이터를 전송
  - 서버로부터 응답을 받게 되었을 경우, 등록이 되었다는 메시지를 띄워준 후, 3초 뒤에 middle 뷰로 이동
*/

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
  TextEditingController loginPw = TextEditingController();
  TextEditingController reason = TextEditingController();

  DateTime? selectedDate;
  DateTime? selectedStartTime;
  DateTime? selectedEndTime;
  String? selectStaId;
  String? selectDoorId;
  Statement? selectSta;
  DoorInfo? selectDoor;
  List<Statement>? statement;
  List<DoorInfo>? doorInfo;

  /*
    < 방문 날짜를 보여주는 메소드 >
    - 만약 아직 방문 날짜를 선택하지 않았을 경우, "방문 일시" 문자열을 보여준다.
    - 만약 방문 날짜를 선택하였다면, 해당 방문 날짜를 "yyyy-MM-DD" 형식으로 보여준다.
  */

  String getText() {
    if (selectedDate == null) {
      return '방문 일시';
    } else {
      return DateFormat('yyyy-MM-dd').format(selectedDate!);
    }
  }

  /*
    < 입출 시간를 보여주는 메소드 >
    - 만약 아직 입출 시간을 선택하지 않았을 경우, "입출 시간" 문자열을 보여준다.
    - 만약 입출 시간을 선택하였다면, 해당 입출 시간을 "HH-MM" 형식으로 보여준다.
  */

  String getTime(time) {
    if (time == null) {
      return '입출 시간';
    } else {
      return '${time!.hour.toString().padLeft(2, '0')}:${time!.minute.toString().padLeft(2, '0')}';
    }
  }

  /*
    < 방문 날짜를 선택하는 메소드 >
    - 현재 날짜를 기준부터 5년 까지 달력 형식으로 날짜를 보여준다.
    - 들어갈 날짜를 선택하면 해당 날짜를 저장한다.
  */
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

  /*
    < 입출 시간을 선택하는 메소드 >
    - 00:00 ~ 23:45의 시간 중에서 자신이 입장할 시간을 선택한다.
    - 들어갈 시간을 선택하면 해당 시간를 저장한다.
  */
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

  /*
    < 입출 시간을 선택하는 메소드 >
    - 00:00 ~ 23:45의 시간 중에서 자신이 퇴장할 시간을 선택한다.
    - 나갈 시간을 선택하면 해당 시간를 저장한다.
  */
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

  /*
    < 건물 정보 및 출입문 정보를 가져오는 메소드 >
    - 사용자가 들어갈 수 있는 모든 건물 이름 및 출입문 이름을 받아온다.
    - 서버로부터 받은 정보들을 리스트화하여 저장한다.
  */
  Future<void> getDoorInfo() async {
    var dio = Dio();
    String url = "${dotenv.env['SERVER_URL']!}/statement/regist";
    var res = await dio.post(url);
    switch (res.statusCode) {
      case 200:
        List tagObjsJson = res.data['staData'] as List;
        List tagObjsJson2 = res.data['doorData'] as List;
        log(tagObjsJson.toString());

        setState(() {
          statement = tagObjsJson
              .map((tagJson) => Statement.fromJson(tagJson))
              .toList();
          doorInfo = tagObjsJson2
              .map((tagJson) => DoorInfo.fromJson(tagJson))
              .toList();
          statement?.map((e) => log(e.toString()));
        });
        break;
      default:
        break;
    }
  }

  /* 
    < 해당 뷰에 들어왔을 때 실행되는 메소드 >
    - 건물 정보 및 출입문 정보를 가져오는 메소드를 실행한다.
  */
  @override
  void initState() {
    super.initState();
    getDoorInfo(); //건물 API 가져오기
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

  /*
    < 정보 기입 메뉴를 보여주는 뷰 >
    - 사용자 이름, 전화번호, 소속, 직책, 패스워드, 방문 사유 입력 칸을 보여준다.
    - 방문시간, 방문 일자, 출입할 건물 및 출입문을 선택할 수 있게 칸을 보여준다.
  */
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
                  child: TextField(
                    controller: loginPw,
                    obscureText: true,
                    decoration: const InputDecoration(
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(),
                        labelText: '고유 패스워드',
                        labelStyle: TextStyle(color: Colors.black),
                        hintText: 'Enter your password'),
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
                          left: 15.0, right: 22.5, top: 15, bottom: 0),
                      child: SizedBox(
                        height: 60,
                        width: 110,
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
                          left: 22.5, right: 15.0, top: 15, bottom: 0),
                      child: SizedBox(
                        height: 60,
                        width: 110,
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
                SizedBox(
                    child: Row(children: <Widget>[
                  if (statement != null)
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 20.0, right: 5.0, top: 15, bottom: 0),
                      child: DropdownButton<Statement>(
                        borderRadius: BorderRadius.circular(10),
                        underline: Container(
                          height: 2,
                          color: Colors.deepPurpleAccent,
                        ),
                        hint: const Text('건물 선택'),
                        value: selectSta, // 수정
                        isDense: true,
                        onChanged: ((value) {
                          setState(() {
                            selectSta = value;
                            selectStaId = value?.staId;
                            selectDoor = null;
                            selectDoorId = null;
                            log(selectStaId.toString());
                          });
                        }),
                        items: statement?.map<DropdownMenuItem<Statement>>(
                            (Statement value) {
                          return DropdownMenuItem<Statement>(
                            value: value,
                            child: Text(value.staName.toString()),
                          );
                        }).toList(),
                      ),
                    ),
                  if (selectStaId != null && doorInfo != null)
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 20.0, right: 20.0, top: 15, bottom: 0),
                      child: DropdownButton<DoorInfo>(
                        borderRadius: BorderRadius.circular(10),
                        underline: Container(
                          height: 2,
                          color: Colors.deepPurpleAccent,
                        ),
                        hint: const Text('출입문 선택'),
                        value: selectDoor, // 수정
                        isDense: true,
                        onChanged: ((value) {
                          setState(() {
                            selectDoor = value;
                            selectDoorId = value?.doorId;
                            log(selectDoorId.toString());
                          });
                        }),
                        items: doorInfo
                            ?.where((element) => element.staId == selectStaId)
                            .map<DropdownMenuItem<DoorInfo>>((DoorInfo value) {
                          return DropdownMenuItem<DoorInfo>(
                            value: value,
                            child: Text(value.doorName.toString()),
                          );
                        }).toList(),
                      ),
                    )
                ])),
                RegisterButton(
                  name: name.text,
                  phoneNum: phoneNum.text,
                  company: company.text,
                  position: position.text,
                  loginPw: loginPw.text,
                  reason: reason.text,
                  selectedDate: selectedDate,
                  selectedStartTime: selectedStartTime,
                  selectedEndTime: selectedEndTime,
                  doorId: selectDoorId,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class RegisterButton extends StatefulWidget {
  const RegisterButton(
      {super.key,
      required this.name,
      required this.phoneNum,
      required this.company,
      required this.position,
      required this.loginPw,
      required this.reason,
      required this.selectedDate,
      required this.selectedStartTime,
      required this.selectedEndTime,
      required this.doorId});

  final String? name;
  final String phoneNum;
  final String? company;
  final String? position;
  final String? loginPw;
  final String? reason;
  final String? doorId;
  final DateTime? selectedDate;
  final DateTime? selectedStartTime;
  final DateTime? selectedEndTime;

  @override
  State<RegisterButton> createState() => _RegisterButtonState();
}

class _RegisterButtonState extends State<RegisterButton> {
  /*
    < API서버로 정보를 전송하는 메소드 >
    - 사용자가 모든 정보를 제대로 기입하였을 경우 실행된다.
    - 사용자가 기입한 정보들을 json 형식으로 API서버로 전송한다.
    - 서버로부터 제대로 응답을 받았을 경우, "등록이 완료되었다"는 메시지를 띄워준다.
    - 3초 후에 middle 뷰로 이동한다.
    - 서버로부터 제대로 응답을 받지 못하면 오류 메시지를 띄워준다.
  */
  Future callAPI(BuildContext context) async {
    try {
      String url = "${dotenv.env['SERVER_URL']!}/user/register";
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
          'loginPw': widget.loginPw,
          'reason': widget.reason,
          'enterTime': enterTime,
          'exitTime': exitTime,
          'doorId': widget.doorId,
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

  /*
    < 시간 포멧 메소드 >
    - 매개변수로 받은 시간을 HH:MM:SS 시간으로 변환하여 리턴해주는 메소드이다.
  */
  Future getStringTime(DateTime time) async {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}';
  }

  /*
    < 사용자 정보를 기입했는지 체크하는 메소드 >
    - 사용자의 이름, 전화번호, 소속, 직책, 패스워드, 방문사유 칸이 비워져있는 경우를 체크한다.
    - 출입할 날짜, 시간, 출입할 문을 선택하지 않았는지 체크한다.
    - 위의 정보 중 하나라도 비워져있는 경우 False를 반환
    - 전화번호의 경우 형식 또한 체크한다. xxx-xxxx-xxxx => 이 형식을 체크
  */
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
    } else if (widget.loginPw == "") {
      showSnackBar(context, '비밀번호를 입력해주세요.');
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
    } else if (widget.doorId == null) {
      showSnackBar(context, '출입할 도어를 선택해주세요.');
      return false;
    }
    return true;
  }

  /*
    < 출입 시간 비교 메소드 >
    - 들어갈 시간과 나갈 시간을 비교하는 메소드이다.
    - 들어갈 시간이 나갈 시간보다 클 경우(늦을 경우) 오류 메시지를 띄운후, False를 반환한다.
    - 들어갈 시간이 나갈 시간보다 작을 경우(빠를 경우) True를 반환한다.
  */
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

  /*
    < 방문 신청 버튼 뷰 >
    - 방문 신청을 누르는 버튼이 존재
    - 해당 버튼 클릭 시, 기입한 정보들을 API서버로 전송한다.
    - 기입한 정보가 부족한 경우는 전송하지 않는다.
  */
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
          '방문 신청',
          style: TextStyle(color: Colors.white, fontSize: 24.0),
        ),
      ),
    );
  }
}

/*
  < 건물 정보를 전달하기 위한 클래스 >
  - 건물 ID, 건물 이름을 넘겨주기 위한 클래스
  - 또한, String형식으로 된 데이터를 Json형식으로 변경해서 리턴해준다.
*/

class Statement {
  final String? staId;
  final String? staName;

  Statement({this.staId, this.staName});

  factory Statement.fromJson(Map<String, dynamic> json) {
    return Statement(staId: json['staId'], staName: json['staName']);
  }
}

/*
  < 출입문 정보를 전달하기 위한 클래스 >
  - 소속된 건물 ID, 출입문 ID, 출입문 이름을 넘겨주기 위한 클래스.
  - 또한, String형식으로 된 데이터를 Json형식으로 변경해서 리턴해준다.
*/

class DoorInfo {
  final String? staId;
  final String? doorId;
  final String? doorName;

  DoorInfo({this.staId, this.doorId, this.doorName});
  factory DoorInfo.fromJson(Map<String, dynamic> json) {
    return DoorInfo(
        staId: json['staId'],
        doorId: json['doorId'],
        doorName: json['doorName']);
  }
}
