import 'package:flutter/material.dart';
import 'package:top_snackbar_flutter/custom_snack_bar.dart';
import 'package:top_snackbar_flutter/top_snack_bar.dart';

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
