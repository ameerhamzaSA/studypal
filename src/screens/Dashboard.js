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
  RefreshControl,
} from 'react-native';
import Text from '../components/RNText';
import TextInput from '../components/RNTextInput';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../utils/index';
import Header from '../components/Header';
import ProgressCircle from 'react-native-progress-circle';
import {get, post} from '../utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import Document from './Document';
import Modal from 'react-native-modal';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/FontAwesome';

const Dashboard = (props) => {
  const [start_date, set_start_date] = useState(new Date());
  const [end_date, set_end_date] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);
  const [dateRange, setDateRange] = useState(false);
  const [settingDate, setSettingDate] = useState('start_date');
  const [loading, setLoading] = useState(false);
  const [pulltoLoad, setpulltoLoad] = useState(false);

  const [study_name, set_study_name] = useState('');
  const [simple, setSimple] = useState({
    total_diaries: 0,
    completed_diaries: 0,
    overdue_diaries: 0,
    diaries: [],
  });
  const [adhoc, setAdhoc] = useState({
    total_diaries: 0,
    completed_today: 0,
    completed_till_today: 0,
    diaries: [],
  });
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    // setLoading(true);
    setpulltoLoad(true);
    try {
      // setLoading(true);
      let result = await post('user/dashboard', {
        start_date: moment(start_date).format('YYYY-MM-DD'),
        end_date: moment(end_date).format('YYYY-MM-DD'),
      });

      if (result.status) {
        set_study_name(result.data.dashboard.study_name);
        await AsyncStorage.setItem(
          'study_name',
          result.data.dashboard.study_name,
        );
        setSimple(result.data.dashboard.sections.diary_section);
        setAdhoc(result.data.dashboard.sections.adhoc_diary_section);
      } else {
        _toast(result.message);
      }
    } catch (err) {
      //console.log(err);
    }
    // setLoading(false);
    setpulltoLoad(false);
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
              <Text style={{fontSize: _font(15), color: colours.white}}>
                ok
              </Text>
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
  const goToDiary = (diary_id, screen) => {
    props.navigation.navigate(screen, {diary_id, start_date, end_date});
  };
  const goToWizard = async (diary_id) => {
    setLoading(true);
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    let result = await post('user/' + parsed.id + '/adhoc/diary/create', {
      diary_id,
    });
    if (result.status) {
      setLoading(false);
      props.navigation.navigate('Wizard', {
        diary_id: result.data.schedule.id,
        study_name,
        start_date: moment(start_date).format('dddd MMMM DD, YYYY'),
        end_date: moment(end_date).format('dddd MMMM DD, YYYY'),
      });
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => props.navigation.openDrawer()}
            style={{
              width: 60,
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
            }}>
            <Image source={images.menu} style={{width: 25, height: 25}} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text style={{color: 'white', fontSize: _font(17)}}>DASHBOARD</Text>
        }
        rightComponent={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={loadData}
              style={{
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
                height: 30,
                marginRight: 5,
              }}>
              <Image source={images.refresh} style={{width: 20, height: 20}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDateRange(true)}
              style={{
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
                height: 30,
                marginRight: 15,
              }}>
              <Image source={images.filter} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          </View>
        }
      />
      {renderDatePicker()}
      <Modal
        isVisible={dateRange}
        backdropOpacity={0.3}
        coverScreen={false}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: WIDTH - 70,
            borderRadius: 5,
            backgroundColor: colours.white,
            paddingVertical: 30,
            paddingHorizontal: 20,
          }}>
          <Text style={{color: colours.black}}>Start Date</Text>
          <TouchableOpacity
            onPress={() => openDatePicker('start_date')}
            style={{
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
            <Text style={{color: colours.black}}>
              {moment(start_date).format('YYYY-MM-DD')}
            </Text>
          </TouchableOpacity>
          <Text style={{color: colours.black, marginTop: 7}}>End Date</Text>
          <TouchableOpacity
            onPress={() => openDatePicker('end_date')}
            style={{
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
            <Text style={{color: colours.black}}>
              {moment(end_date).format('YYYY-MM-DD')}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 35,
            }}>
            <TouchableOpacity
              onPress={loadData}
              style={{
                width: 70,
                height: 70,
                backgroundColor: 'lightblue',
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.tick}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDateRange(false)}
              style={{
                width: 70,
                height: 70,
                backgroundColor: 'lightblue',
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.close}
                style={{width: 25, height: 25}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Loader is_visible={loading} />
      <View style={{flex: 1, alignItems: 'center'}}>
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
            paddingHorizontal: 10,
            width: WIDTH - 30,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: _font(18),
              color: colours.black,
              textAlign: 'center',
            }}>
            {study_name}
          </Text>
          <Text
            style={{
              fontSize: _font(18),
              color: colours.blue,
              marginTop: 10,
              textAlign: 'center',
            }}>
            {moment(new Date()).format('dddd MMMM DD, YYYY')}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={pulltoLoad} onRefresh={loadData} />
          }>
          {/*<View style={{height: 80, width: WIDTH - 30, marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*  <View style={{flex: 1.4, alignItems: 'center', flexDirection: 'row'}}>*/}
          {/*    <View>*/}
          {/*      <Text style={{fontSize: _font(18), color: colours.blue}}>DIARIES</Text>*/}
          {/*      <Text style={{fontSize: _font(14), color: colours.black}}>TOTAL</Text>*/}
          {/*    </View>*/}
          {/*    <View style={{width: 2, height: 35, backgroundColor: 'grey', marginHorizontal: 3}}/>*/}
          {/*    <Text style={{fontSize: _font(23), color: colours.blue}}>{simple.total_diaries}</Text>*/}
          {/*  </View>*/}
          {/*  <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>*/}

          {/*    <ProgressCircle*/}
          {/*      percent={80}*/}
          {/*      radius={45}*/}
          {/*      borderWidth={5}*/}
          {/*      color={colours.green}*/}
          {/*      shadowColor={colours.lightblue}*/}
          {/*      bgColor={colours.white}*/}
          {/*    >*/}
          {/*      <Text style={{color: colours.green, fontSize: _font(15)}}>{simple.completed_diaries}</Text>*/}
          {/*      <Text style={{color: colours.green, fontSize: _font(11)}}>{'COMPLETED'}</Text>*/}
          {/*    </ProgressCircle>*/}
          {/*    <ProgressCircle*/}
          {/*      percent={80}*/}
          {/*      radius={45}*/}
          {/*      borderWidth={5}*/}
          {/*      color={colours.red}*/}
          {/*      shadowColor={colours.lightblue}*/}
          {/*      bgColor={colours.white}*/}
          {/*    >*/}
          {/*      <Text style={{color: colours.red, fontSize: _font(15)}}>{simple.overdue_diaries}</Text>*/}
          {/*      <Text style={{color: colours.red, fontSize: _font(11)}}>{'OVERDUE'}</Text>*/}
          {/*    </ProgressCircle>*/}

          {/*  </View>*/}
          {/*</View>*/}
          <View style={{padding: 2, alignItems: 'center'}}>
            <View
              style={{
                width: WIDTH - 30,
                marginTop: 5,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                paddingBottom: 20,
                shadowColor: 'black',
                shadowOpacity: 0.26,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 10,
                elevation: 3,
                backgroundColor: '#E0E0E0',
                maxHeight: 250,
              }}>
              <Text
                style={{
                  fontSize: _font(15),
                  color: colours.black,
                  marginLeft: 2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexDirection: 'row',
                  paddingBottom: 20,
                }}>
                TASKS DUE
              </Text>
              <FlatList
                data={simple.diaries}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                renderItem={({item, index}) => {
                  if (item.current == 0) {
                    return (
                      <View style={{padding: 2}}>
                        <View
                          key={index}
                          style={{
                            width: '100%',
                            marginTop: 8,
                            marginBottom: 2,
                            // flexDirection: 'row',
                            paddingRight: 5,
                            paddingLeft: 5,
                            paddingTop: 17,
                            paddingBottom: 17,
                            borderRadius: 5,
                            shadowColor: 'black',
                            shadowOpacity: 0.26,
                            shadowOffset: {width: 0, height: 2},
                            shadowRadius: 10,
                            elevation: 3,
                            backgroundColor: 'white',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              goToDiary(item.diary_id, 'PendingDiaries')
                            }>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'space-between',
                                }}>
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize: _font(14),
                                    fontWeight: 'bold',
                                    color: '#807C7C',
                                  }}>
                                  {item.diary_name}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 0.2,
                                }}>
                                <Text
                                  style={{
                                    fontSize: _font(18),
                                    color: colours.blue,
                                    textAlign: 'right',
                                    paddingRight: 10,
                                  }}>
                                  {/* <Image
                                    source={images.plus}
                                    style={{width: 18, height: 18}}
                                  /> */}
                                  <Icon
                                    size={18}
                                    color="gray"
                                    name="arrow-circle-right"
                                    family="FontAwesome"
                                  />
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                }}
              />
            </View>
          </View>
          {/*//adhoc*/}

          {/*<View style={{height: 80, width: WIDTH - 30, marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>*/}
          {/*  <View style={{flex: 1.2, alignItems: 'center', flexDirection: 'row'}}>*/}
          {/*    <View>*/}
          {/*      <Text style={{fontSize: _font(14), color: colours.blue}}>ADHOC</Text>*/}
          {/*      <Text style={{fontSize: _font(18), color: colours.blue}}>DIARIES</Text>*/}
          {/*      <Text style={{fontSize: _font(14), color: colours.black}}>TOTAL</Text>*/}
          {/*    </View>*/}
          {/*    <View style={{width: 2, height: 60, backgroundColor: 'grey', marginHorizontal: 3}}/>*/}
          {/*    <Text style={{fontSize: _font(23), color: colours.blue}}>{adhoc.total_diaries}</Text>*/}
          {/*  </View>*/}
          {/*  <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>*/}

          {/*    <ProgressCircle*/}
          {/*      percent={80}*/}
          {/*      radius={45}*/}
          {/*      borderWidth={5}*/}
          {/*      color={colours.green}*/}
          {/*      shadowColor={colours.lightblue}*/}
          {/*      bgColor={colours.white}*/}
          {/*    >*/}
          {/*      <Text style={{color: colours.green, fontSize: _font(15)}}>{adhoc.completed_today}</Text>*/}
          {/*      <Text style={{color: colours.green, fontSize: _font(10.5)}}>{'COMPLETED'}</Text>*/}
          {/*    </ProgressCircle>*/}
          {/*    <ProgressCircle*/}
          {/*      percent={80}*/}
          {/*      radius={45}*/}
          {/*      borderWidth={5}*/}
          {/*      color={colours.red}*/}
          {/*      shadowColor={colours.lightblue}*/}
          {/*      bgColor={colours.white}*/}
          {/*    >*/}
          {/*      <Text style={{color: colours.red, fontSize: _font(15)}}>{adhoc.completed_till_today}</Text>*/}
          {/*      <Text style={{color: colours.red, fontSize: _font(10.5)}}>{'COMPLETED'}</Text>*/}
          {/*      <Text style={{color: colours.red, fontSize: _font(10.5)}}>{'TODAY'}</Text>*/}
          {/*    </ProgressCircle>*/}

          {/*  </View>*/}
          {/*</View>*/}
          <View style={{padding: 2}}>
            <View
              style={{
                width: WIDTH - 30,
                marginTop: 10,
                borderRadius: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                paddingBottom: 20,
                marginBottom: 20,
                shadowColor: 'black',
                shadowOpacity: 0.26,
                shadowOffset: {width: 0, height: 2},
                shadowRadius: 10,
                elevation: 3,
                backgroundColor: '#E0E0E0',
                maxHeight: 250,
              }}>
              <Text
                style={{
                  fontSize: _font(15),
                  color: colours.black,
                  marginBottom: 5,
                  marginLeft: 2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexDirection: 'row',
                  paddingBottom: 20,
                }}>
                DAILY DIARIES
              </Text>
              {
                <FlatList
                  data={adhoc.diaries}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  renderItem={({item, index}) => {
                    return (
                      <View style={{padding: 2}}>
                        <View
                          key={index}
                          style={{
                            width: '100%',
                            marginTop: 5,
                            marginBottom: 5,
                            paddingRight: 5,
                            paddingLeft: 5,
                            paddingTop: 15,
                            paddingBottom: 15,
                            borderRadius: 5,
                            shadowColor: 'black',
                            shadowOpacity: 0.26,
                            shadowOffset: {width: 0, height: 2},
                            shadowRadius: 10,
                            elevation: 3,
                            backgroundColor: 'white',
                          }}>
                          <TouchableOpacity
                            onPress={() => goToWizard(item.diary_id)}>
                            <View style={{width: '100%', flexDirection: 'row'}}>
                              <View
                                style={{
                                  flex: 0.8,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    fontSize: _font(13),
                                    fontWeight: 'bold',
                                    color: '#807C7C',
                                  }}>
                                  {item.diary_name}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 2,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={{flex: 2, alignItems: 'center'}}>
                                  <Text
                                    style={{
                                      fontSize: _font(11),
                                      color: colours.green,
                                    }}>
                                    COMPLETED
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: _font(15),
                                      color: colours.green,
                                    }}>
                                    {item.completed_till_today}
                                  </Text>
                                </View>
                                <View style={{flex: 1, alignItems: 'center'}}>
                                  {/* <Image
                                    source={images.plus}
                                    style={{width: 20, height: 20}}
                                  /> */}
                                  <Icon
                                    size={24}
                                    color="gray"
                                    name="arrow-circle-right"
                                    family="FontAwesome"
                                  />
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              }
            </View>
          </View>
        </ScrollView>
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
