import React, {Fragment, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {images, colours, _alert, _font, WIDTH, _toast} from '../utils/index';
import Text from '../components/RNText';
import AdhocDiaries from '../screens/AdhocDiaries';
import AsyncStorage from '@react-native-community/async-storage';
import {fcmService} from '../FCMService';
import {onRegister,onNotification,onOpenNotification} from '../notifications'

const drawer_items_font = 13;
const CustomDrawer = (props) => {
  const [profileUri, setProfileUri] = useState('');
  const [name, setName] = useState('');

 
  React.useEffect(() => {
    fcmService.register(onRegister, onNotification, onOpenNotification);
  }, []);

  useEffect(() => {
    loadProfile();
  });
  const loadProfile = async () => {
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    setProfileUri(parsed.mobile_profile_pic_path);
    setName(parsed.name);
  };
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    props.navigation.navigate('Auth');
  };
  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: colours.purple}} />
      <View style={styles.container}>
        <View
          style={{flex: 1, backgroundColor: 'yellow', flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#BDE0FE',
              paddingTop: 140,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colours.blue,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.dashboard}
                style={{width: 20, height: 20}}
              />
            </View>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colours.blue,
                marginTop: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={images.bell} style={{width: 20, height: 20}} />
            </View>
          </View>
          <View
            style={{
              flex: 3,
              backgroundColor: colours.blue,
              paddingHorizontal: 20,
              paddingVertical: 30,
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.closeDrawer();
              }}
              style={{
                alignSelf: 'flex-end',
                paddingHorizontal: 10,
                height: 25,
              }}>
              <Image
                source={images.back_white}
                style={{width: 20, height: 20}}
              />
            </TouchableOpacity>
            <View style={{paddingTop: 100, paddingLeft: 30}}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate('Dashboard');
                }}>
                <Text style={{fontSize: _font(15), color: colours.white}}>
                  DASHBOARD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Profile')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  PROFILE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('PendingDiaries')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  PENDING DIARIES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('OverdueDiaries')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  OVERDUE DIARIES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('CompletedDiaries')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  COMPLETED DIARIES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('AdhocDiaries')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  ADHOC DIARIES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('StudyDocuments')}>
                <Text
                  style={{
                    fontSize: _font(15),
                    color: colours.white,
                    marginTop: 20,
                  }}>
                  STUDY DOCUMENTS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{height: 80, flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: profileUri}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colours.lightblue,
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={{flex: 2.5, justifyContent: 'center'}}>
            <Text style={{fontSize: _font(15), color: colours.blue}}>
              {name}
            </Text>
            <Text
              style={{fontSize: _font(12), marginTop: 5, color: colours.blue}}>
              San Fransisco, CA
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={images.logout} style={{width: 20, height: 20}} />
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView style={{flex: 0, backgroundColor: colours.white}} />
    </Fragment>
  );
};
export default CustomDrawer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItem: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
