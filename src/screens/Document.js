import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Text from '../components/RNText';
import {images, colours, _font, WIDTH, HEIGHT} from '../utils/index';
import moment from 'moment';

const Document = (props) => {
  const item = props.item;
  console.log(item.diary_id);
  return (
    <View style={{
      width: '100%',
      borderColor: 'lightgrey',
      borderWidth: 1,
      marginTop: 10,
      flexDirection: 'row',
    }}>
      <View style={{width: '85%', flexDirection: 'row'}}>
        <View style={{width: '42%', justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={{marginLeft: 5, color: 'grey', fontSize: _font(18)}}>{item.diary.diary_name}</Text>
        </View>
        <View style={{width: 1, height: 40, backgroundColor: 'lightgrey', marginTop: 5, marginBottom: 5}}/>
        <View style={{width: '42%', justifyContent: 'center', alignItems: 'flex-end'}}>
          <Text style={{
            marginLeft: 10,
            color: 'grey',
            fontSize: _font(18),
          }}>{moment(item.created_at).format('DD MM, Y')}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={props.onClick} style={{
        width: '15%',
        backgroundColor: props.color,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image source={props.image} style={{width: 20, height: 20}} resizeMode={'contain'}/>
      </TouchableOpacity>
    </View>

  );
};
export default Document;
