import React, {Component, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, ImageBackground, SafeAreaView} from 'react-native';
import Text from '../../components/RNText';
import TextInput from '../../components/RNTextInput';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../../utils/index';
import Modal from 'react-native-modal';
import {post} from '../../utils/api';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';

const Reset = (props) => {

  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(props.route.params.email);

  const submitPass = async () => {
    setLoading(true);
    let result = await post('reset-password', {email, password});
    if (result.status) {
      _toast('Password Changed Sucessfully');
      props.navigation.navigate('Login');
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };


  return (
    <SafeAreaView style={styles.container}>

      <ImageBackground style={{flex: 1}} source={images.login}>
        <Loader is_visible={loading}/>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: colours.white, fontSize: _font(25), marginTop: 40}}>STUDY PAL</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TextInput
            style={{
              borderColor: colours.blue,
              width: WIDTH - 100,
              height: 40,
              borderWidth: 1,
              paddingHorizontal: 15,
              color: colours.blue,
            }}
            placeholder={'New Password'}
            onChangeText={(value) => setPass(value)}
            value={password}
          />
          <TouchableOpacity onPress={submitPass} style={{
            borderRadius: 4,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: colours.blue,
            width: WIDTH - 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
          }}>
            <Text style={{color: colours.white, fontSize: _font(18)}}>Change Password</Text>
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
export default Reset;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
