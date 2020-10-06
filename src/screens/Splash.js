import React, {Component, useEffect} from 'react';
import {StyleSheet, ImageBackground, Image, View, Clipboard} from 'react-native';
import {images} from '../utils/index';
import AsyncStorage from '@react-native-community/async-storage';
// import {fcmService} from '../FCMService';
// import {localNotificationService} from '../LocalNotificationService';
import {CommonActions} from '@react-navigation/native';

const Splash = (props) => {

  useEffect(() => {
    // fcmService.registerAppWithFCM();
    // fcmService.register(onRegister, onNotification, onOpenNotification);
    //localNotificationService.configure(onOpenNotification);

    // async function onRegister(token) {
    //   console.log('[App] onRegister: ', token);
    //   await AsyncStorage.setItem('token', token);
    //   Clipboard.setString(token);
    // }

    // function onNotification(notify) {
    //   console.log('[App] onNotification: ', notify);
    //   const options = {
    //     soundName: 'default',
    //     playSound: true, //,
    //     // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
    //     // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
    //   };
    //   localNotificationService.showNotification(
    //     0,
    //     notify.title,
    //     notify.body,
    //     notify,
    //     options,
    //   );
    // }

    // function onOpenNotification(notify) {
    //   console.log('[App] onOpenNotification: ', notify);
    //   alert('Open Notification: ' + notify.body);
    // }

    loadData();
    // return () => {
    //   console.log('[App] unRegister');
    //   // fcmService.unRegister();
    //   // localNotificationService.unregister();
    // };

  }, []);

  const loadData = async () => {

    setTimeout(
      function () {
        _bootstrapAsync();
      }.bind(this),
      2000,
    );

  };

  const _bootstrapAsync = async () => {

    let user = await AsyncStorage.getItem('user');
    if (user) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Drawer'},
          ],
        }),
      );
    } else {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Auth'},
          ],
        }),
      );
    }
  };


  return (
    <ImageBackground source={images.splash_bg} style={{flex: 1}}/>
  );
};
export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
