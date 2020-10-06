import React, {Component, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, ImageBackground, SafeAreaView} from 'react-native';
import Text from '../../components/RNText';
import TextInput from '../../components/RNTextInput';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../../utils/index';
import Modal from 'react-native-modal';
import {post} from '../../utils/api';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressCircle from 'react-native-progress-circle';
import {CommonActions} from '@react-navigation/native';

const Login = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const login = async () => {
    setLoading(true);
    let fcm_token = await AsyncStorage.getItem('token');
    //console.log('here is fcm',fcm_token)
    let result = await post('login', {fcm_token, email, password});
    if (result.status) {
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Drawer'},
          ],
        }),
      );
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };
  const forgotPassword = async () => {
    setForgot(false);
    setLoading(true);
    let result = await post('forgot-password', {email});
    if (result.status) {
      props.navigation.navigate('Code', {email});
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        isVisible={forgot}
        backdropOpacity={0.3}
        coverScreen={false}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={{
          width: WIDTH - 70,
          borderRadius: 5,
          backgroundColor: colours.white,
          paddingVertical: 50,
          paddingHorizontal: 20,
        }}>
          <Text>EMAIL ADDRESS</Text>
          <TextInput
            style={{
              marginTop: 7,
              borderColor: colours.black,
              width: WIDTH - 100,
              height: 40,
              borderWidth: 1,
              paddingHorizontal: 15,
              backgroundColor: 'lightgrey',
              color: colours.black,
            }}
            placeholder={'Email'}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <Text style={{alignSelf: 'center', marginTop: 50, color: colours.blue}}>Are you sure to proceed?</Text>
          <View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35}}>
            <TouchableOpacity onPress={forgotPassword} style={{
              width: 70,
              height: 70,
              backgroundColor: 'lightblue',
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Image source={images.tick}
                     style={{width: 25, height: 25}}
                     resizeMode={'contain'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setForgot(false)} style={{
              width: 70,
              height: 70,
              backgroundColor: 'lightblue',
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Image source={images.close}
                     style={{width: 25, height: 25}}
                     resizeMode={'contain'}/>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ImageBackground style={{flex: 1}} source={images.login}>
        <Loader is_visible={loading}/>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: colours.white, fontSize: _font(25), marginTop: 40}}>STUDY PAL</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TextInput
            style={{
              borderColor: colours.blue,
              width: WIDTH - 50,
              height: 50,
              borderWidth: 1,
              paddingHorizontal: 15,
              color: colours.blue,
              fontSize:_font(18)
            }}
            keyboardType={'email-address'}
            placeholder={'Email'}
            onChangeText={(value) => setEmail(value)}
            value={email}
          />
          <TextInput
            style={{
              borderColor: colours.blue,
              width: WIDTH - 50,
              height: 50,
              borderWidth: 1,
              paddingHorizontal: 15,
              marginTop: 20,
              color: colours.blue,
              fontSize:_font(18)
            }}
            secureTextEntry={true}
            placeholder={'Password'}
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
          <TouchableOpacity onPress={() => setForgot(true)}
                            style={{alignItems: 'center', paddingVertical: 10, marginTop: 10}}>
            <Text style={{color: colours.blue, fontSize: _font(13), textDecorationLine: 'underline'}}>FORGOT
              PASSWORD?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={login} style={{
            borderRadius: 4,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: colours.blue,
            width: WIDTH - 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
          }}>
            <Text style={{color: colours.white, fontSize: _font(22)}}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          minHeight: 10,
          width: WIDTH,
          position: 'absolute',
          alignItems: 'center',
          bottom: 10,
        }}>
          <Text style={{color: colours.blue, fontSize: _font(11)}}>@COPYRIGHTS - DELVE HEALTH</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>

  );
};
export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
