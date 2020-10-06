import React, {Component} from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/service';
import {localNotificationService} from './src/LocalNotificationService';
import {onOpenNotification} from './src/notifications'

const App = () => {
  React.useEffect(() => {
    localNotificationService.configure(onOpenNotification);
    
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootNavigation />
    </NavigationContainer>
  );
};
export default App;
