package com.example.app;

import androidx.annotation.NonNull;

import com.minew.beacon.BeaconValueIndex;
import com.minew.beacon.BluetoothState;
import com.minew.beacon.MinewBeacon;
import com.minew.beacon.MinewBeaconManager;
import com.minew.beacon.MinewBeaconManagerListener;

import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.plugin.common.MethodChannel;

import android.bluetooth.BluetoothAdapter;
import android.os.Bundle;
import android.content.ContextWrapper;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.Build.VERSION;
import android.os.Build.VERSION_CODES;

// import android.support.v4.app.ActivityCompat;
// import android.support.v4.content.ContextCompat;
// import android.support.v7.app.AppCompatActivity;
// import android.content.pm.PackageManager;

import java.util.List;

public class MainActivity extends FlutterActivity {
    private static final String CHANNEL = "samples.flutter.dev/battery";
    private static final int REQUEST_ACCESS_FINE_LOCATION = 1000;

    private MinewBeaconManager mMinewBeaconManager;
    private boolean isScanning;
    private int state;
    public String deviceUUID;
    public String errorMessage;

    @Override
    public void configureFlutterEngine(@NonNull FlutterEngine flutterEngine) {
        super.configureFlutterEngine(flutterEngine);
        new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), CHANNEL)
                .setMethodCallHandler(
                        (call, result) -> {
                            // This method is invoked on the main thread.
                            if (call.method.equals("getBeaconId")) {
                                getBeaconId();
                                if(errorMessage != null){
                                    result.success(errorMessage);
                                }
                                if (deviceUUID != null) {
                                    result.success(deviceUUID);
                                } else {
                                    result.error("UNAVAILABLE", "no Search BeaconDevice.", null);
                                }
                            } else {
                                result.notImplemented();
                            }
                        }
                );
    }

    private void getBeaconId() {
        try{
            mMinewBeaconManager = MinewBeaconManager.getInstance(this);
            BluetoothState bluetoothState = mMinewBeaconManager.checkBluetoothState();
            if (mMinewBeaconManager != null) {
                switch (bluetoothState) {
                    case BluetoothStateNotSupported:
                        errorMessage = "BluetoothStateNotSupported";
                        break;
                    case BluetoothStatePowerOff:
                        errorMessage = "BluetoothStatePowerOff";
                        return;
                    case BluetoothStatePowerOn:
                        break;
                }
            }
            if (isScanning) {
                isScanning = false;
                if (mMinewBeaconManager != null) {
                    mMinewBeaconManager.stopScan();
                }
            } else {
                isScanning = true;
                try {
                    mMinewBeaconManager.startScan();
                } catch (Exception e) {
                    errorMessage = e.getMessage();
                }
            }
            //checkLocationPermition();
            mMinewBeaconManager.setDeviceManagerDelegateListener(new MinewBeaconManagerListener() {
                /**
                 *   if the manager find some new beacon, it will call back this method.
                 *
                 *  @param minewBeacons  new beacons the manager scanned
                 */
                @Override
                public void onAppearBeacons(List<MinewBeacon> minewBeacons) {
    
                }
    
                /**
                 *  if a beacon didn't update data in 10 seconds, we think this beacon is out of rang, the manager will call back this method.
                 *
                 *  @param minewBeacons beacons out of range
                 */
                @Override
                public void onDisappearBeacons(List<MinewBeacon> minewBeacons) {
                    /*for (MinewBeacon minewBeacon : minewBeacons) {
                        String deviceName = minewBeacon.getBeaconValue(BeaconValueIndex.MinewBeaconValueIndex_Name).getStringValue();
                        Toast.makeText(getApplicationContext(), deviceName + "  out range", Toast.LENGTH_SHORT).show();
                    }*/
                }
    
                /**
                 *  the manager calls back this method every 1 seconds, you can get all scanned beacons.
                 *
                 *  @param minewBeacons all scanned beacons
                 */
                @Override
                public void onRangeBeacons(final List<MinewBeacon> minewBeacons) {
                    for (MinewBeacon mMinewBeacon : minewBeacons) {
                        deviceUUID = mMinewBeacon.getBeaconValue(BeaconValueIndex.MinewBeaconValueIndex_UUID).getStringValue();
                    }
                }
    
                /**
                 *  the manager calls back this method when BluetoothStateChanged.
                 *
                 *  @param state BluetoothState
                 */
                @Override
                public void onUpdateState(BluetoothState state) {
                    switch (state) {
                        case BluetoothStatePowerOn:
                            break;
                        case BluetoothStatePowerOff:
                            errorMessage = "BluetoothStatePowerOff";
                            break;
                        case BluetoothStateNotSupported:
                            errorMessage = "BluetoothStatePowerOff";
                            break;
                    }
                }
            });
            //initManager();
            //checkBluetooth();
            //initListener();
        }catch(Exception e){
            e.printStackTrace();
            throw e;
        }
        
    }

//     private void checkLocationPermition() {
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {

//             int permissionCheck = ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION);

//             if(permissionCheck == PackageManager.PERMISSION_DENIED){

//                 // 권한 없음
//                 ActivityCompat.requestPermissions(this,
//                         new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
//                         REQUEST_ACCESS_FINE_LOCATION);


//             } else{

//                 // ACCESS_FINE_LOCATION 에 대한 권한이 이미 있음.

//             }


//         }

// // OS가 Marshmallow 이전일 경우 권한체크를 하지 않는다.
//         else{

//         }
//     }

    // private void initManager() {
    //     mMinewBeaconManager = MinewBeaconManager.getInstance(this);
    // }

    // private void checkBluetooth() {
    //     BluetoothState bluetoothState = mMinewBeaconManager.checkBluetoothState();
    //     switch (bluetoothState) {
    //         case BluetoothStateNotSupported:
    //             finish();
    //             break;
    //         case BluetoothStatePowerOff:
    //             break;
    //         case BluetoothStatePowerOn:
    //             break;
    //     }
    // }

    // private void initListener() {
    //     if (mMinewBeaconManager != null) {
    //         BluetoothState bluetoothState = mMinewBeaconManager.checkBluetoothState();
    //         switch (bluetoothState) {
    //             case BluetoothStateNotSupported:
    //                 finish();
    //                 break;
    //             case BluetoothStatePowerOff:
    //                 return;
    //             case BluetoothStatePowerOn:
    //                 break;
    //         }
    //     }
    //     if (isScanning) {
    //         isScanning = false;
    //         if (mMinewBeaconManager != null) {
    //             mMinewBeaconManager.stopScan();
    //         }
    //     } else {
    //         isScanning = true;
    //         try {
    //             mMinewBeaconManager.startScan();
    //         } catch (Exception e) {
    //             e.printStackTrace();
    //         }
    //     }
        
    //     mMinewBeaconManager.setDeviceManagerDelegateListener(new MinewBeaconManagerListener() {
    //         /**
    //          *   if the manager find some new beacon, it will call back this method.
    //          *
    //          *  @param minewBeacons  new beacons the manager scanned
    //          */
    //         @Override
    //         public void onAppearBeacons(List<MinewBeacon> minewBeacons) {

    //         }

    //         /**
    //          *  if a beacon didn't update data in 10 seconds, we think this beacon is out of rang, the manager will call back this method.
    //          *
    //          *  @param minewBeacons beacons out of range
    //          */
    //         @Override
    //         public void onDisappearBeacons(List<MinewBeacon> minewBeacons) {
    //             /*for (MinewBeacon minewBeacon : minewBeacons) {
    //                 String deviceName = minewBeacon.getBeaconValue(BeaconValueIndex.MinewBeaconValueIndex_Name).getStringValue();
    //                 Toast.makeText(getApplicationContext(), deviceName + "  out range", Toast.LENGTH_SHORT).show();
    //             }*/
    //         }

    //         /**
    //          *  the manager calls back this method every 1 seconds, you can get all scanned beacons.
    //          *
    //          *  @param minewBeacons all scanned beacons
    //          */
    //         @Override
    //         public void onRangeBeacons(final List<MinewBeacon> minewBeacons) {
    //             for (MinewBeacon mMinewBeacon : minewBeacons) {
    //                 deviceUUID = mMinewBeacon.getBeaconValue(BeaconValueIndex.MinewBeaconValueIndex_UUID).getStringValue();
    //             }
    //         }

    //         /**
    //          *  the manager calls back this method when BluetoothStateChanged.
    //          *
    //          *  @param state BluetoothState
    //          */
    //         //@Override
    //         public void onUpdateState(BluetoothState state) {
    //             switch (state) {
    //                 case BluetoothStatePowerOn:
    //                     break;
    //                 case BluetoothStatePowerOff:
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //     });
    // }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //stop scan
        if (isScanning) {
            mMinewBeaconManager.stopScan();
        }
    }

}