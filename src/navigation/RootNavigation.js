import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../navigation/CustomDrawer';
import Login from '../screens/auth/Login';
import Code from '../screens/auth/Code';
import Reset from '../screens/auth/Reset';
import Wizard from '../screens/Wizard';
import Profile from '../screens/auth/Profile';
import PendingDiaries from '../screens/PendingDiaries';
import OverdueDiaries from '../screens/OverdueDiaries';
import CompletedDiaries from '../screens/CompletedDiaries';
import AdhocDiaries from '../screens/AdhocDiaries';
import StudyDocuments from '../screens/StudyDocuments';
import Document from '../screens/Document';
import Dashboard from '../screens/Dashboard';
import Splash from '../screens/Splash';
import {WIDTH} from '../utils/index';
const ScreenStack = createStackNavigator();
const ScreenStackNavigator = () => (
  <ScreenStack.Navigator headerMode={'none'}>
    <ScreenStack.Screen
      name="Dashboard"
      component={Dashboard}
    />
    <ScreenStack.Screen
      name="Profile"
      component={Profile}
    />
    <ScreenStack.Screen
      name="PendingDiaries"
      component={PendingDiaries}
    />
    <ScreenStack.Screen
      name="OverdueDiaries"
      component={OverdueDiaries}
    />
    <ScreenStack.Screen
      name="CompletedDiaries"
      component={CompletedDiaries}
    />
    <ScreenStack.Screen
      name="AdhocDiaries"
      component={AdhocDiaries}
    />
    <ScreenStack.Screen
      name="StudyDocuments"
      component={StudyDocuments}
    />
    <ScreenStack.Screen
      name="Wizard"
      component={Wizard}
    />
  </ScreenStack.Navigator>
);

const DrawerNavigator = createDrawerNavigator();
const Drawer = () => {
    return (
      <DrawerNavigator.Navigator drawerStyle={{width: WIDTH}} drawerContent={props => <CustomDrawer  {...props} />}>
        <DrawerNavigator.Screen name="Dash" component={ScreenStackNavigator}/>
      </DrawerNavigator.Navigator>
    );
  }
;
const AuthStack = createStackNavigator();
const AuthStackNavigator = () => (
  <AuthStack.Navigator headerMode={'none'}>
    <AuthStack.Screen
      name="Login"
      component={Login}
    />
    <AuthStack.Screen
      name="Code"
      component={Code}
    />
    <AuthStack.Screen
      name="Reset"
      component={Reset}
    />

  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
const RootNavigation = () => (
  <RootStack.Navigator headerMode={'none'}>
    <RootStack.Screen
      name="Splash"
      component={Splash}
    />
    <RootStack.Screen
      name="Auth"
      component={AuthStackNavigator}
    />
    <RootStack.Screen
      name="Drawer"
      component={Drawer}
    />
  </RootStack.Navigator>
);

export default RootNavigation;
