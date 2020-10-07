import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {localNotificationService} from './LocalNotificationService';

export const onOpenNotification = (notification) => {
  //console.log('notification*******', notification);
    localNotificationService.showNotification(
      notification.id,
      notification.title,
      notification.message || notification.body,
      notification.data,
    );
};

export const onRegister = async (token) => {
  console.log(token); // Save Token Here
  await AsyncStorage.setItem('token',JSON.stringify(token.token))
};

export const onNotification = (notification) => {
  //console.log('************', notification);
};
