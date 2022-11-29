import 'package:flutter/material.dart';
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';

/*
  - 오류 메시지 혹은 안내 메시지를 SnackBar(Toast창)를 통해 어플 상단에 띄어주는 메소드이다.
  - 띄어줄 메시지를 매개변수로 전달해주면 해당 메시지를 SnackBar에 띄어준다.
  - 다른 곳에서 사용할 수 있도록 컴포넌트화 했다.
*/

void showSnackBar(BuildContext context, String text) {
  showTopSnackBar(
      context,
      displayDuration: const Duration(milliseconds: 1000),
      CustomSnackBar.success(
          icon: const Icon(null),
          backgroundColor: const Color(0xff81a4ff),
          textStyle: const TextStyle(color: Colors.white, fontSize: 17.0),
          message: text));
}
