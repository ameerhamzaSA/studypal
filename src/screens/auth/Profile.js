import React, {Component, useEffect, useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, ImageBackground, SafeAreaView, ScrollView} from 'react-native';
import Text from '../../components/RNText';
import TextInput from '../../components/RNTextInput';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../../utils/index';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';
import {post, post2} from '../../utils/api';
import ImagePicker from 'react-native-image-picker';

const Profile = (props) => {

  const [profileUri, setProfileUri] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    setEmail(parsed.email);
    setName(parsed.name);
    setProfileUri((parsed.mobile_profile_pic_path && parsed.mobile_profile_pic_path != '') ? 'parsed.mobile_profile_pic_path':'data:image/jpeg;base64,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');
  };
  const uploadImage = async () => {
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    ImagePicker.showImagePicker({
      title: 'Select Avatar',
      mediaType: 'image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }, async (response) => {
      //console.log('Response = ', response);

      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.error) {
        //console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      } else {
        let d = new Date();
        let image = {
          uri: response.uri,
          type: response.type,
          name: d.getTime() + '-' + response.fileName,
        };
        const fd = new FormData;
        fd.append('image', image);
        //fd.append('email', email);
        setLoading(true);
        let result = await post2('user/' + parsed.id + '/profile/update?api_token=' + parsed.api_token, fd);
        if (result.status) {
          _toast('Avatar updated Successfully');
        } else {
          _toast(result.message);
        }
        setLoading(false);
      }
    });

  };
  const updateProfile = async () => {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      if (password == '' && confirmPassword == '') {
        if (name == '') {
          _toast('Enter name');
        } else {
          setLoading(true);
          const fd = new FormData;
          fd.append('name', name);
          fd.append('email', email);
          setLoading(true);
          let result = await post2('user/' + parsed.id + '/profile/update?api_token=' + parsed.api_token, fd);
          if (result.status) {
            _toast('Profile Updated Successfully');
          } else {
            _toast(result.message);
          }
          setLoading(false);
        }
      } else {

        if (name == '') {
          _toast('Enter name');
        } else {
          if (password != confirmPassword) {
            _toast('Password and Confirm Password must be same');
          } else {
            setLoading(true);
            const fd = new FormData;
            fd.append('name', name);
            fd.append('email', email);
            fd.append('password', password);
            setLoading(true);
            let result = await post2('user/' + parsed.id + '/profile/update?api_token=' + parsed.api_token, fd);
            if (result.status) {
              _toast('Profile Updated Successfully');
            } else {
              _toast(result.message);
            }
            setLoading(false);
          }
        }

      }
    }
  ;
  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={<TouchableOpacity onPress={() => props.navigation.pop()}
                                         style={{
                                           width: 60,
                                           justifyContent: 'center',
                                           alignItems: 'center',
                                           height: 60,
                                         }}>
          <Image source={images.back_white} style={{width: 30, height: 30}}/>
        </TouchableOpacity>}
        middleComponent={<Text style={{color: 'white', fontSize: _font(17)}}>Profile</Text>}
      />
      <Loader is_visible={loading}/>
      <View style={{flex: 1}}>
        <ImageBackground source={{uri: profileUri}}
                         style={{
                           flex: 1,
                           backgroundColor: colours.lightblue,
                           justifyContent: 'flex-end',
                           alignItems: 'flex-end',
                         }}>

          <TouchableOpacity onPress={uploadImage} style={{
            width: 50,
            height: 50,
            backgroundColor: colours.lightblue,
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            marginBottom: 10,
          }}>

            <Image source={images.pencil} style={{width: 15, height: 15}}/>

          </TouchableOpacity>
        </ImageBackground>
        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20}}>
          <ScrollView>
            <View>
              <Text style={{fontSize: _font(12), color: 'grey'}}>EMAIL</Text>
              <TextInput
                style={{
                  marginTop: 3,
                  borderColor: colours.blue,
                  width: WIDTH - 50,
                  height: 40,
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  color: colours.blue,
                }}
                placeholder={'Email'}
                value={email}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: _font(12), color: 'grey'}}>Name</Text>
              <TextInput
                style={{
                  marginTop: 3,
                  borderColor: colours.blue,
                  width: WIDTH - 50,
                  height: 40,
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  color: colours.blue,
                }}
                placeholder={'Name'}
                value={name}
                onChangeText={(value) => setName(value)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: _font(12), color: 'grey'}}>PASSWORD</Text>
              <TextInput
                style={{
                  marginTop: 3,
                  borderColor: colours.blue,
                  width: WIDTH - 50,
                  height: 40,
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  color: colours.blue,
                }}
                placeholder={'Password'}
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
            </View>
            <View style={{marginTop: 10}}>
              <Text style={{fontSize: _font(12), color: 'grey'}}>PASSWORD CONFIRMATION</Text>
              <TextInput
                style={{
                  marginTop: 3,
                  borderColor: colours.blue,
                  width: WIDTH - 50,
                  height: 40,
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  color: colours.blue,
                }}
                placeholder={'Confirm Password'}
                value={confirmPassword}
                onChangeText={(value) => setConfirmPassword(value)}
              />
            </View>
            <TouchableOpacity onPress={updateProfile} style={{
              borderRadius: 4,
              paddingHorizontal: 15,
              paddingVertical: 10,
              backgroundColor: colours.blue,
              width: WIDTH - 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}>
              <Text style={{color: colours.white, fontSize: _font(15)}}>UPDATE PROFILE</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>

  )
    ;
};
export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
