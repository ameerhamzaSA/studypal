import React, {Component, useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Text from '../components/RNText';
import {images, colours, _font, WIDTH, HEIGHT, _toast} from '../utils/index';
import Header from '../components/Header';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import * as data from '../../sample';
import TextInput from '../components/RNTextInput';
import Next from '../components/Next';
import Previous from '../components/Previous';
import Submit from '../components/Submit';
import AsyncStorage from '@react-native-community/async-storage';
import {get, post} from '../utils/api';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import index from 'rn-fetch-blob';
import Loader from '../components/Loader';
import Fake from '../components/Fake';

const Wizard = (props) => {
  const [fields, setFields] = useState({});
  const [nestedAnswers, setNestedAnswers] = useState({});
  const [renderFields, setRenderFields] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState('');

  const [dateModal, setDateModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPath, setItemPath] = useState('');
  const [itemType, setItemType] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    loadQuestion();
  }, [language]);

  const loadQuestion = async () => {
    setLoading(true);
    setCurrentPage(1);
    _scrolToFirst();
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);

    let result = await get(
      'user/' +
        parsed.id +
        '/schedule/' +
        props.route.params.diary_id +
        '/questions?&api_token=' +
        parsed.api_token +
        '&' +
        language,
    );
    if (result.status) {
      setLanguages(result.data.diary_languages);
      let yasir = {};
      result.data.questions.map((item, index) => {
        if (item.answer_type == 1) {
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'text',
              value: '',
              frequency: result.data.schedule.frequency,
              item,
            },
          };
          yasir = temObject;
        }
        if (item.answer_type == 2) {
          let subObj = {};
          item.specifications.map((subItems, index) => {
            subObj[subItems.name] = [];
            //console.log(subItems.name);
            let spec_questions = JSON.parse(subItems.specification_questions);
            //console.log('+++++++++++++++');
            //console.log(JSON.parse(subItems.specification_questions));
            Object.keys(spec_questions.specification_question).map((sub) => {
              //console.log(spec_questions.specification_question[sub]);
              if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '1'
              ) {
                subObj[subItems.name].push({
                  value: '',
                  type: 'text',
                  name: spec_questions.specification_question[sub].name,
                });
              } else if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '2'
              ) {
                subObj[subItems.name].push({
                  value: '',
                  type: 'radio', //radio
                  name: spec_questions.specification_question[sub].name,
                  answers:
                    spec_questions.specification_question[sub]
                      .specification_answers,
                });
              } else if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '3'
              ) {
                subObj[subItems.name].push({
                  value: [],
                  type: 'checkbox',
                  name: spec_questions.specification_question[sub].name,
                  answers:
                    spec_questions.specification_question[sub]
                      .specification_answers,
                });
              } else if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '4'
              ) {
                subObj[subItems.name].push({
                  value: '',
                  type: 'date',
                  name: spec_questions.specification_question[sub].name,
                });
              } else if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '5'
              ) {
                subObj[subItems.name].push({
                  value: '',
                  type: 'time',
                  name: spec_questions.specification_question[sub].name,
                });
              } else if (
                spec_questions.specification_question[sub]
                  .specification_answer_type == '6'
              ) {
                subObj[subItems.name].push({
                  value: '',
                  type: 'datetime',
                  name: spec_questions.specification_question[sub].name,
                });
              }
            });
            //console.log(subObj);
          });
          //console.log('sub_question', subObj);
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'radio', //radio
              value: '',
              frequency: result.data.schedule.frequency,
              item,
              subObj,
            },
          };
          yasir = temObject;
        }
        if (item.answer_type == 3) {
          let spec = {};
          item.specifications.map((item, index) => {
            let ob = {
              ...spec,
              [item.name]: {value: ''},
            };
            spec = ob;
          });
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'checkbox',
              values: [],
              frequency: result.data.schedule.frequency,
              item,
              spec,
            },
          };
          yasir = temObject;
        }
        if (item.answer_type == 4) {
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'date',
              value: '',
              frequency: result.data.schedule.frequency,
              item,
            },
          };
          yasir = temObject;
        }
        if (item.answer_type == 5) {
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'time',
              value: '',
              frequency: result.data.schedule.frequency,
              item,
            },
          };
          yasir = temObject;
        }
        if (item.answer_type == 6) {
          let temObject = {
            ...yasir,
            [item.id]: {
              type: 'datetime',
              value: '',
              frequency: result.data.schedule.frequency,
              item,
            },
          };
          yasir = temObject;
        }
      });
      const entries = Object.entries(yasir);
      setRenderFields(entries);
      setFields(yasir);
    } else {
      _toast(result.message);
    }
    setLoading(false);
  };
  const renderDatePicker = () => {
    if (dateModal) {
      return (
        <DateTimePickerModal
          isVisible={dateModal}
          mode={itemType}
          onConfirm={onChange}
          onCancel={() => {
            setItemName('');
            setItemPath('');
            setItemType('');
            setDateModal(false);
          }}
        />
      );
    } else {
      return null;
    }
  };
  const onChange = (date) => {
    setDateModal(false);
    if (itemType == 'date') {
      onChangeText(itemName, itemPath, moment(date).format('YYYY-MM-DD'));
    }
    if (itemType == 'time') {
      onChangeText(itemName, itemPath, moment(date).format('HH:mm:ss'));
    }
    if (itemType == 'datetime') {
      onChangeText(
        itemName,
        itemPath,
        moment(date).format('YYYY-MM-DD HH:mm:ss'),
      );
    }
  };
  const onChangeNested = (date, type, item1, item2) => {
    setDateModal(false);
    if (type == 'date') {
      onChangeSpec(item1, item2, moment(date).format('YYYY-MM-DD'));
    }
    if (type == 'time') {
      onChangeSpec(item1, item2, moment(date).format('HH:mm:ss'));
    }
    if (type == 'datetime') {
      onChangeSpec(item1, item2, moment(date).format('YYYY-MM-DD HH:mm:ss'));
    }
  };
  const openDateTimePicker = (name, path, type) => {
    setItemName(name);
    setItemPath(path);
    setItemType(type);
    setDateModal(true);
  };
  const onChangeText = (key, path, newValue) => {
    let obj = fields;
    var parts = path.split('.');
    while (parts.length > 1 && (obj = obj[parts.shift()])) {}
    obj[parts.shift()] = newValue;
    let tem = {...fields, [key]: obj};

    const entries = Object.entries(tem);
    setRenderFields(entries);
    setFields(tem);
    setItemName('');
    setItemPath('');
    setItemType('');
  };
  const onChangeSpec = (item, key, newValue, checkbox) => {
    let dd = {...nestedAnswers};
    // console.log('dd ---',dd['10']['Option 1'])
    for (const [_key, value] of Object.entries(
      fields[item.item.answer.question_id].subObj,
    )) {
      console.log('before', fields[item.item.answer.question_id].subObj[_key]);
      for (
        let index = 0;
        index < fields[item.item.answer.question_id].subObj[_key].length;
        index++
      ) {
        if (
          fields[item.item.answer.question_id].subObj[_key][index].name ==
          key.name
        ) {
          let parentOption = fields[item.item.answer.question_id].subObj;
          let subOptions = parentOption[_key];
          let subOptionSingle = subOptions[index];
          if (checkbox) {
            let already = false;
            for (let index = 0; index < subOptionSingle.value.length; index++) {
              if (subOptionSingle.value[index].includes(newValue)) {
                subOptionSingle.value.splice(index, 1);
                already = true;
              }
            }
            if (!already) {
              subOptionSingle.value.push(newValue);
            }
          } else {
            subOptionSingle.value = newValue;
          }
          console.log('checbox', subOptionSingle.value);
          subOptions[index] = subOptionSingle;
          parentOption[_key] = subOptions;
          dd[item.item.answer.question_id] = parentOption;

          // dd = {
          //   [item.item.answer.question_id]: {
          //     [_key]: {
          //       [fields[item.item.answer.question_id].subObj[_key][index]
          //         .name]: subOptionSingle,
          //     },
          //   },
          // };
        }
      }
    }
    setNestedAnswers(dd);
  };

  const renderDate = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 10,
          width: WIDTH - 30,
          marginBottom: 5,
        }}>
        <Text
          style={{
            fontSize: _font(18),
            color: colours.black,
            textAlign: 'center',
          }}>
          {props.route.params.study_name}
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
    );
  };
  const onChangecheckbox = (key, path, newValue) => {
    let obj = fields;
    var parts = path.split('.');
    while (parts.length > 1 && (obj = obj[parts.shift()])) {}
    let new_arr = [];
    let arr_len = fields[key].values.length;
    let pre_arr = fields[key].values;
    if (arr_len < 1) {
      obj[parts.shift()] = [newValue];
    } else {
      let included = true;
      included = pre_arr.includes(newValue);
      if (included) {
        let filtered = pre_arr.filter((item, index) => {
          if (item != newValue) {
            return item;
          }
        });
        obj[parts.shift()] = filtered;
      } else {
        obj[parts.shift()] = [...pre_arr, newValue];
      }
    }
    let tem = {...fields, [key]: obj};
    const entries = Object.entries(tem);
    setRenderFields(entries);
    setFields(tem);
  };
  const _renderBtns = (index, total) => {
    if (index == 0 && total == 0) {
      return (
        <View
          style={{
            height: 60,
            backgroundColor: colours.blue,
            width: WIDTH,
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <Fake />
          <Text style={{fontSize: _font(15), color: colours.white}}>
            {currentPage}/{renderFields.length}
          </Text>
          <Submit onClick={submit} />
        </View>
      );
    }
    if (index == 0 && total > 0) {
      return (
        <View
          style={{
            height: 60,
            backgroundColor: colours.blue,
            width: WIDTH,
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <Fake />
          <Text style={{fontSize: _font(15), color: colours.white}}>
            {currentPage}/{renderFields.length}
          </Text>
          <Next onClick={_scrolToNext} />
        </View>
      );
    }
    if (index > 0 && index < total) {
      return (
        <View
          style={{
            height: 60,
            backgroundColor: colours.blue,
            width: WIDTH,
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <Previous onClick={_scrolToPrev} />
          <Text style={{fontSize: _font(15), color: colours.white}}>
            {currentPage}/{renderFields.length}
          </Text>
          <Next onClick={_scrolToNext} />
        </View>
      );
    }
    if (index == total) {
      return (
        <View
          style={{
            height: 60,
            backgroundColor: colours.blue,
            width: WIDTH,
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <Previous onClick={_scrolToPrev} />
          <Text style={{fontSize: _font(15), color: colours.white}}>
            {currentPage}/{renderFields.length}
          </Text>
          <Submit onClick={submit} />
        </View>
      );
    }
  };
  const _scrolToFirst = () => {
    let ww = 0;
    scrollRef.current.scrollTo({x: ww, y: 0, animated: true});
  };
  const _scrolToNext = () => {
    let ww = currentPage * WIDTH;
    scrollRef.current.scrollTo({x: ww, y: 0, animated: true});
    setCurrentPage(currentPage + 1);
  };
  const _scrolToPrev = () => {
    let ww = (currentPage - 1) * WIDTH - WIDTH;
    scrollRef.current.scrollTo({x: ww, y: 0, animated: true});
    setCurrentPage(currentPage - 1);
  };
  const submit = async () => {
    setLoading(true);
    let user = await AsyncStorage.getItem('user');
    let parsed = JSON.parse(user);
    // let data={
    //   fields: JSON.stringify(fields),
    //   nestedAnswer: JSON.stringify(nestedAnswers)
    // }
    let result = await post('user/' + parsed.id + '/questions/answers', {
      data: JSON.stringify(fields),
    });
    if (result.status) {
      props.navigation.pop();
    } else {
      console.log(result)
      _toast(result.message);
    }
    setLoading(false);
  };
  const hideMenu = (lang) => {
    menuRef.current.hide();
    setLanguage('language=' + lang);
  };

  const showMenu = () => {
    menuRef.current.show();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftComponent={
          <TouchableOpacity
            onPress={() => props.navigation.pop()}
            style={{
              width: 60,
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
            }}>
            <Image source={images.back_white} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text style={{color: 'white', fontSize: _font(17)}}>
            DIARY QUESTIONS
          </Text>
        }
        rightComponent={
          <Menu
            ref={menuRef}
            button={
              <TouchableOpacity
                onPress={showMenu}
                style={{
                  width: 60,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                }}>
                <Image source={images.global} style={{width: 30, height: 30}} />
              </TouchableOpacity>
            }>
            <MenuItem onPress={() => hideMenu('')}>English</MenuItem>
            {languages.map((item, index) => {
              return <MenuItem onPress={() => hideMenu(item)}>{item}</MenuItem>;
            })}
          </Menu>
        }
      />
      {renderDatePicker()}
      <Loader is_visible={loading} />
      <View style={{flex: 1}}>
        <ScrollView
          scrollEnabled={false}
          ref={scrollRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          contentContainerStyle={{paddingTop: 10}}>
          {renderFields.map((item, index) => {
            let length_fields = renderFields.length;
            if (item[1].type == 'text') {
              if (fields[item[0]]) {
                return (
                  <View
                    key={index}
                    style={{alignItems: 'center', width: WIDTH}}>
                    {renderDate()}
                    <View
                      style={{
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View style={{marginTop: 20, width: '90%'}}>
                      <View style={{marginTop: 20}}>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            textAlignVertical: 'top',
                            paddingLeft: 10,
                          }}
                          multiline={true}
                          numberOfLines={12}
                          value={fields[item[0]].value}
                          onChangeText={(value) => {
                            onChangeText(item[0], `${item[0]}.value`, value);
                          }}
                        />
                      </View>
                    </View>
                    {_renderBtns(index, length_fields - 1)}
                  </View>
                );
              }
            }
            if (item[1].type == 'radio') {
              return (
                <View key={index} style={{alignItems: 'center', width: WIDTH}}>
                  {renderDate()}
                  <ScrollView
                    contentContainerStyle={{
                      alignItems: 'center',
                      width: WIDTH,
                    }}>
                    <View
                      style={{
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 15,
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        marginTop: 20,
                        width: '100%',
                        paddingHorizontal: 15,
                      }}>
                      {item[1].item.answers.map((option, index2) => {
                        //console.log(item[1]);
                        let spec_keys_arr = Object.keys(item[1].subObj);
                        //console.log('--------------------------------');
                        //console.log(
                        //   'spec_keys_arr',
                        //   item[1].subObj[spec_keys_arr],
                        // );
                        return (
                          <>
                            <TouchableOpacity
                              key={index2}
                              onPress={() =>
                                onChangeText(
                                  item[0],
                                  `${item[0]}.value`,
                                  option,
                                )
                              }
                              style={{
                                width: '100%',
                                marginTop: 20,
                                flexDirection: 'row',
                              }}>
                              <Image
                                source={
                                  item[1].value == option
                                    ? images.checked
                                    : images.unchecked
                                }
                                style={{width: 20, height: 20}}
                                resizeMode={'contain'}
                              />
                              <Text
                                style={{
                                  fontSize: _font(15),
                                  color: colours.black,
                                  marginLeft: 10,
                                }}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                            {spec_keys_arr.includes(option) && (
                              <View
                                style={{
                                  marginLeft: 30,
                                  padding: item[1].value == option ? 50 : 0,
                                  backgroundColor: '#D9D6D6',
                                  borderRadius: 20,
                                }}>
                                {item[1].value == option
                                  ? item[1].subObj[option].map(
                                      (subQuestion, i) => {
                                        if (subQuestion.type == 'text') {
                                          return (
                                            <>
                                              <Text
                                                style={{
                                                  fontSize: _font(12),
                                                  color: colours.black,
                                                  textAlign: 'left',
                                                }}>
                                                {subQuestion.name}
                                              </Text>

                                              <TextInput
                                                style={{
                                                  textAlignVertical: 'top',
                                                  paddingLeft: 10,
                                                  borderBottomWidth: 1,
                                                }}
                                                multiline={true}
                                                numberOfLines={2}
                                                value={
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ] != undefined &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value
                                                }
                                                onChangeText={(value) => {
                                                  onChangeSpec(
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                    value,
                                                  );
                                                  console.log(
                                                    'nestedAnswer',
                                                    nestedAnswers[
                                                      item[1].item.answer
                                                        .question_id
                                                    ][option][i].value,
                                                  );
                                                }}
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'radio') {
                                          return (
                                            <>
                                              <Text>{subQuestion.name}</Text>
                                              {subQuestion.answers.map(
                                                (subQOptions, index3) => {
                                                  return (
                                                    <>
                                                      <TouchableOpacity
                                                        key={index3}
                                                        onPress={() => {
                                                          onChangeSpec(
                                                            item[1],
                                                            item[1].subObj[
                                                              option
                                                            ][i],
                                                            subQOptions,
                                                          );
                                                        }}
                                                        style={{
                                                          width: '100%',
                                                          marginTop: 20,
                                                          flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                          source={
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ] != undefined &&
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ][option][i]
                                                              .value ==
                                                              subQOptions
                                                              ? images.checked
                                                              : images.unchecked
                                                          }
                                                          style={{
                                                            width: 20,
                                                            height: 20,
                                                          }}
                                                          resizeMode={'contain'}
                                                        />
                                                        <Text
                                                          style={{
                                                            fontSize: _font(15),
                                                            color:
                                                              colours.black,
                                                            marginLeft: 10,
                                                          }}>
                                                          {subQOptions}
                                                        </Text>
                                                      </TouchableOpacity>
                                                    </>
                                                  );
                                                },
                                              )}
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'checkbox') {
                                          return (
                                            <>
                                              <Text>{subQuestion.name}</Text>
                                              {subQuestion.answers.map(
                                                (subQOptions, index3) => {
                                                  return (
                                                    <>
                                                      <TouchableOpacity
                                                        key={index3}
                                                        onPress={() => {
                                                          onChangeSpec(
                                                            item[1],
                                                            item[1].subObj[
                                                              option
                                                            ][i],
                                                            subQOptions,
                                                            'checkbox',
                                                          );
                                                        }}
                                                        style={{
                                                          width: '100%',
                                                          marginTop: 20,
                                                          flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                          source={
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ] != undefined &&
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ][option][
                                                              i
                                                            ].value.includes(
                                                              subQOptions,
                                                            )
                                                              ? images.check
                                                              : images.uncheck
                                                          }
                                                          style={{
                                                            width: 20,
                                                            height: 20,
                                                          }}
                                                          resizeMode={'contain'}
                                                        />
                                                        <Text
                                                          style={{
                                                            fontSize: _font(15),
                                                            color:
                                                              colours.black,
                                                            marginLeft: 10,
                                                          }}>
                                                          {subQOptions}
                                                        </Text>
                                                      </TouchableOpacity>
                                                    </>
                                                  );
                                                },
                                              )}
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'time') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'time'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'time',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'date') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'date'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'date',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'datetime') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'datetime'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'datetime',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                      },
                                    )
                                  : // <TextInput
                                    //   style={{
                                    //     borderWidth: 1,
                                    //     paddingLeft: 10,
                                    //     marginTop: 10,
                                    //   }}
                                    //   value={
                                    //     fields[item[0]]
                                    //       ? fields[item[0]].spec[option].value
                                    //       : ''
                                    //   }
                                    //   onChangeText={(value) => {
                                    //     onChangeSpec(item[0], `${option}`, value);
                                    //   }}
                                    // />
                                    null}
                              </View>
                            )}
                          </>
                        );
                      })}
                    </View>
                  </ScrollView>
                  {_renderBtns(index, length_fields - 1)}
                </View>
              );
            }
            if (item[1].type == 'checkbox') {
              return (
                <View key={index} style={{alignItems: 'center', width: WIDTH}}>
                  {renderDate()}
                  <ScrollView
                    contentContainerStyle={{
                      alignItems: 'center',
                      width: WIDTH,
                    }}>
                    <View
                      style={{
                        marginTop: 20,
                        paddingHorizontal: 15,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        marginTop: 20,
                        width: '100%',
                        paddingHorizontal: 15,
                      }}>
                      {item[1].item.answers.map((option, index2) => {
                        let spec_keys_arr = Object.keys(item[1].subObj);

                        return (
                          <>
                            <TouchableOpacity
                              key={index2}
                              onPress={() =>
                                onChangecheckbox(
                                  item[0],
                                  `${item[0]}.values`,
                                  option,
                                )
                              }
                              style={{
                                width: '100%',
                                marginTop: 20,
                                flexDirection: 'row',
                              }}>
                              <Image
                                source={
                                  item[1].values.includes(option)
                                    ? images.check
                                    : images.uncheck
                                }
                                style={{width: 20, height: 20}}
                                resizeMode={'contain'}
                              />
                              <Text
                                style={{
                                  fontSize: _font(15),
                                  color: colours.black,
                                  marginLeft: 10,
                                }}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                            {spec_keys_arr.includes(option) && (
                              <View
                                style={{
                                  marginLeft: 30,
                                  padding: item[1].value == option ? 50 : 0,
                                  backgroundColor: '#D9D6D6',
                                  borderRadius: 20,
                                }}>
                                {item[1].value == option
                                  ? item[1].subObj[option].map(
                                      (subQuestion, i) => {
                                        if (subQuestion.type == 'text') {
                                          return (
                                            <>
                                              <Text
                                                style={{
                                                  fontSize: _font(12),
                                                  color: colours.black,
                                                  textAlign: 'left',
                                                }}>
                                                {subQuestion.name}
                                              </Text>

                                              <TextInput
                                                style={{
                                                  textAlignVertical: 'top',
                                                  paddingLeft: 10,
                                                  borderBottomWidth: 1,
                                                }}
                                                multiline={true}
                                                numberOfLines={2}
                                                value={
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ] != undefined &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value
                                                }
                                                onChangeText={(value) => {
                                                  onChangeSpec(
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                    value,
                                                  );
                                                  console.log(
                                                    'nestedAnswer',
                                                    nestedAnswers[
                                                      item[1].item.answer
                                                        .question_id
                                                    ][option][i].value,
                                                  );
                                                }}
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'radio') {
                                          return (
                                            <>
                                              <Text>{subQuestion.name}</Text>
                                              {subQuestion.answers.map(
                                                (subQOptions, index3) => {
                                                  return (
                                                    <>
                                                      <TouchableOpacity
                                                        key={index3}
                                                        onPress={() => {
                                                          onChangeSpec(
                                                            item[1],
                                                            item[1].subObj[
                                                              option
                                                            ][i],
                                                            subQOptions,
                                                          );
                                                        }}
                                                        style={{
                                                          width: '100%',
                                                          marginTop: 20,
                                                          flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                          source={
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ] != undefined &&
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ][option][i]
                                                              .value ==
                                                              subQOptions
                                                              ? images.checked
                                                              : images.unchecked
                                                          }
                                                          style={{
                                                            width: 20,
                                                            height: 20,
                                                          }}
                                                          resizeMode={'contain'}
                                                        />
                                                        <Text
                                                          style={{
                                                            fontSize: _font(15),
                                                            color:
                                                              colours.black,
                                                            marginLeft: 10,
                                                          }}>
                                                          {subQOptions}
                                                        </Text>
                                                      </TouchableOpacity>
                                                    </>
                                                  );
                                                },
                                              )}
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'checkbox') {
                                          return (
                                            <>
                                              <Text>{subQuestion.name}</Text>
                                              {subQuestion.answers.map(
                                                (subQOptions, index3) => {
                                                  return (
                                                    <>
                                                      <TouchableOpacity
                                                        key={index3}
                                                        onPress={() => {
                                                          onChangeSpec(
                                                            item[1],
                                                            item[1].subObj[
                                                              option
                                                            ][i],
                                                            subQOptions,
                                                            'checkbox',
                                                          );
                                                        }}
                                                        style={{
                                                          width: '100%',
                                                          marginTop: 20,
                                                          flexDirection: 'row',
                                                        }}>
                                                        <Image
                                                          source={
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ] != undefined &&
                                                            nestedAnswers[
                                                              item[1].item
                                                                .answer
                                                                .question_id
                                                            ][option][
                                                              i
                                                            ].value.includes(
                                                              subQOptions,
                                                            )
                                                              ? images.check
                                                              : images.uncheck
                                                          }
                                                          style={{
                                                            width: 20,
                                                            height: 20,
                                                          }}
                                                          resizeMode={'contain'}
                                                        />
                                                        <Text
                                                          style={{
                                                            fontSize: _font(15),
                                                            color:
                                                              colours.black,
                                                            marginLeft: 10,
                                                          }}>
                                                          {subQOptions}
                                                        </Text>
                                                      </TouchableOpacity>
                                                    </>
                                                  );
                                                },
                                              )}
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'time') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'time'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'time',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'date') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'date'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'date',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                        if (subQuestion.type == 'datetime') {
                                          return (
                                            <>
                                              <Text>
                                                {nestedAnswers[
                                                  item[1].item.answer
                                                    .question_id
                                                ] &&
                                                  nestedAnswers[
                                                    item[1].item.answer
                                                      .question_id
                                                  ][option][i].value}
                                              </Text>
                                              <DateTimePickerModal
                                                isVisible={true}
                                                mode={'datetime'}
                                                onConfirm={(date) =>
                                                  onChangeNested(
                                                    date,
                                                    'datetime',
                                                    item[1],
                                                    item[1].subObj[option][i],
                                                  )
                                                }
                                              />
                                            </>
                                          );
                                        }
                                      },
                                    )
                                  : null}
                              </View>
                            )}
                          </>
                        );
                      })}
                    </View>
                  </ScrollView>
                  {_renderBtns(index, length_fields - 1)}
                </View>
              );
            }
            if (item[1].type == 'date') {
              if (fields[item[0]]) {
                return (
                  <View
                    key={index}
                    style={{alignItems: 'center', width: WIDTH}}>
                    {renderDate()}
                    <View
                      style={{
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View style={{marginTop: 20, width: '90%'}}>
                      <View style={{marginTop: 20, alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            openDateTimePicker(
                              item[0],
                              `${item[0]}.value`,
                              'date',
                            )
                          }
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
                            {fields[item[0]].value}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {_renderBtns(index, length_fields - 1)}
                  </View>
                );
              }
            }
            if (item[1].type == 'time') {
              if (fields[item[0]]) {
                return (
                  <View
                    key={index}
                    style={{alignItems: 'center', width: WIDTH}}>
                    {renderDate()}
                    <View
                      style={{
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View style={{marginTop: 20, width: '90%'}}>
                      <View style={{marginTop: 20, alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            openDateTimePicker(
                              item[0],
                              `${item[0]}.value`,
                              'time',
                            )
                          }
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
                            {fields[item[0]].value}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {_renderBtns(index, length_fields - 1)}
                  </View>
                );
              }
            }
            if (item[1].type == 'datetime') {
              if (fields[item[0]]) {
                return (
                  <View
                    key={index}
                    style={{alignItems: 'center', width: WIDTH}}>
                    {renderDate()}
                    <View
                      style={{
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: _font(15),
                          color: colours.black,
                          textAlign: 'center',
                        }}>
                        {item[1].item.question}
                      </Text>
                      {item[1].item.language_found == false ? (
                        <Text style={{fontSize: _font(15), color: colours.red}}>
                          Language not found
                        </Text>
                      ) : null}
                    </View>
                    <View style={{marginTop: 20, width: '90%'}}>
                      <View style={{marginTop: 20, alignItems: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            openDateTimePicker(
                              item[0],
                              `${item[0]}.value`,
                              'datetime',
                            )
                          }
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
                            {fields[item[0]].value}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {_renderBtns(index, length_fields - 1)}
                  </View>
                );
              }
            }
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default Wizard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
