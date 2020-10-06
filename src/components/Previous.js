import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {images, colours, _font} from '../utils/index';

const Previous = (props) => {


  return (
    <TouchableOpacity onPress={props.onClick}
      style={{
        backgroundColor: colours.white,
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
      }}>
      <Text style={{
        color: colours.purple,
        fontSize: _font(13),
      }}>Previous</Text>
    </TouchableOpacity>

  );
};
export default Previous;
