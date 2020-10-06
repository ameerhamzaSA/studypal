import React, {Component, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Text from '../components/RNText';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../utils/index';
import Header from '../components/Header';
import {get} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import Document from './StudyDocument';
import Loader from '../components/Loader';

const Dashboard = (props) => {
  const [loading, setLoading] = useState(false);
  const [diary, setDiary] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    setLoading(true);
    let result = await get('user/' + parsed.id + '/documents?api_token=' + parsed.api_token);
    if (result.status) {
      setDiary(result.data.documents);
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };


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
          <Image source={images.back_white} style={{width: 25, height: 25}}/>
        </TouchableOpacity>}
        middleComponent={<Text style={{color: 'white', fontSize: _font(17)}}>STUDY DOCUMENTS</Text>}


      />
      <Loader is_visible={loading}/>
      {
        (diary.length <= 0) ?
          <Text style={{alignSelf: 'center', marginTop: 10, fontSize: _font(15)}}>NO RECORD FOUND</Text> : null
      }
      <View style={{flex: 1, alignItems: 'center'}}>
        <FlatList
          data={diary}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{height: HEIGHT, width: WIDTH - 20}}
          renderItem={({item, index}) => {
            return (
              <Document color={colours.red} item={item} image={images.down_arrow}/>
            );
          }
          }
        />
      </View>
    </SafeAreaView>

  );
};
export default Dashboard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
