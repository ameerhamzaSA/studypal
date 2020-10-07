import React, {Component} from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/service';
import {localNotificationService} from './src/LocalNotificationService';
import {onOpenNotification} from './src/notifications'
import { LogBox } from 'react-native';

const App = () => {
  React.useEffect(() => {
    localNotificationService.configure(onOpenNotification);
    LogBox.ignoreAllLogs(true)
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigation />
    </NavigationContainer>
  );
};
export default App;
