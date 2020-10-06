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
import TextInput from '../components/RNTextInput';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../utils/index';
import Header from '../components/Header';
import ProgressCircle from 'react-native-progress-circle';
import {post} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import Document from './Document';
import Modal from 'react-native-modal';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../components/Loader';

const Dashboard = (props) => {
  const [start_date, set_start_date] = useState((props.route.params) ? props.route.params.start_date : new Date());
  const [end_date, set_end_date] = useState((props.route.params) ? props.route.params.end_date : new Date());
  const [date, setDate] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);
  const [dateRange, setDateRange] = useState(false);
  const [settingDate, setSettingDate] = useState('start_date');
  const [loading, setLoading] = useState(false);
  const [diary_id, setDiaryId] = useState((props.route.params) ? props.route.params.diary_id : 0);
  const [study_name, set_study_name] = useState('');
  const [diary, setDiary] = useState([]);
  const [refreshing, set_refreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    let std = await AsyncStorage.getItem('study_name');
    set_study_name(std);
    set_refreshing(true)
    let result = await post('user/diaries', {
      start_date: moment(start_date).format('YYYY-MM-DD'),
      end_date: moment(end_date).format('YYYY-MM-DD'),
      type: 1,
      adhoc: 0,
      diary_id: (diary_id == 0) ? '' : diary_id,
    });
    if (result.status) {
      setDiary(result.data.dashboard);
    } else {
      _toast(result.message);
    }
    set_refreshing(false)
    setDateRange(false);
  };
  const openDatePicker = (type) => {
    if (type == 'start_date') {
      setSettingDate('start_date');
      setDate(start_date);
      setDateModal(true);
    } else {
      setSettingDate('end_date');
      setDate(end_date);
      setDateModal(true);
    }
  };
  const renderDatePicker = () => {
    if (Platform.OS == 'ios') {
      return (
        <Modal isVisible={dateModal}>
          <View style={{backgroundColor: 'white', paddingVertical: 10}}>
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              mode={'date'}
              value={date}
              is24Hour={true}
              display="default"
              maxDate={new Date()}
              onChange={(date) => onChange(date)}
            />
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                backgroundColor: colours.purple,
                alignSelf: 'center',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: _font(15), color: colours.white}}>ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else {
      if (dateModal) {
        return (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            mode={'date'}
            value={date}
            is24Hour={true}
            display="default"
            maxDate={new Date()}
            onChange={(date) => onChange(date)}
          />
        );
      } else {
        return null;
      }

    }
  };
  const onChange = (date) => {
    if (Platform.OS == 'ios') {
      setDateModal(false);
      if (settingDate == 'start_date') {
        set_start_date(new Date(date.nativeEvent.timestamp));
        setDate(new Date(date.nativeEvent.timestamp));
      } else {
        set_end_date(new Date(date.nativeEvent.timestamp));
        setDate(new Date(date.nativeEvent.timestamp));
      }
    } else {
      setDateModal(false);
      if (settingDate == 'start_date') {
        set_start_date(new Date(date.nativeEvent.timestamp));
        setDate(new Date(date.nativeEvent.timestamp));
      } else {
        set_end_date(new Date(date.nativeEvent.timestamp));
        setDate(new Date(date.nativeEvent.timestamp));
      }
    }
  };
  const goToWizard = (diary_id) => {
    props.navigation.navigate('Wizard', {diary_id,study_name,start_date:moment(start_date).format('dddd MMMM DD, YYYY'),end_date:moment(end_date).format('dddd MMMM DD, YYYY')});
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
        middleComponent={<Text style={{color: 'white', fontSize: _font(17)}}>OVERDUE DIARIES</Text>}
        rightComponent={<TouchableOpacity onPress={() => setDateRange(true)}
                                          style={{
                                            width: 60,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 60,
                                          }}>
          <Image source={images.filter} style={{width: 20, height: 20}}/>
        </TouchableOpacity>}

      />
      {renderDatePicker()}
      <Modal
        isVisible={dateRange}
        backdropOpacity={0.3}
        coverScreen={false}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={{
          width: WIDTH - 70,
          borderRadius: 5,
          backgroundColor: colours.white,
          paddingVertical: 30,
          paddingHorizontal: 20,
        }}>
          <Text style={{color: colours.black}}>Start Date</Text>
          <TouchableOpacity onPress={() => openDatePicker('start_date')} style={{
            marginTop: 7,
            borderColor: colours.black,
            width: WIDTH - 100,
            height: 40,
            borderWidth: 1,
            paddingHorizontal: 15,
            backgroundColor: 'lightgrey',
            color: colours.black,
            justifyContent: 'center',
          }}>
            <Text style={{color: colours.black}}>{moment(start_date).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <Text style={{color: colours.black, marginTop: 7}}>End Date</Text>
          <TouchableOpacity onPress={() => openDatePicker('end_date')} style={{
            marginTop: 7,
            borderColor: colours.black,
            width: WIDTH - 100,
            height: 40,
            borderWidth: 1,
            paddingHorizontal: 15,
            backgroundColor: 'lightgrey',
            color: colours.black,
            justifyContent: 'center',
          }}>
            <Text style={{color: colours.black}}>{moment(end_date).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <View style={{marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35}}>
            <TouchableOpacity onPress={loadData} style={{
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
            <TouchableOpacity onPress={() => setDateRange(false)} style={{
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
      <Loader is_visible={loading}/>
      <View style={{alignItems: 'center', marginTop: 15, paddingHorizontal: 10, width: WIDTH - 30, marginBottom: 10}}>
        <Text style={{fontSize: _font(18), color: colours.black, textAlign: 'center'}}>{study_name}</Text>
        <Text style={{
          fontSize: _font(18),
          color: colours.blue,
          marginTop: 10,
          textAlign: 'center'
        }}>{moment(new Date()).format('dddd MMMM DD, YYYY')}</Text>
      </View>
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
          refreshing={refreshing}
          onRefresh={loadData}
          renderItem={({item, index}) => {
            return (
              <Document color={colours.red} onClick={() => goToWizard(item.id)} item={item}
                        image={images.right_arrow}/>
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
