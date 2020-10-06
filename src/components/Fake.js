import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {images, colours, _font} from '../utils/index';

const Fake = (props) => {


  return (
    <TouchableOpacity
      style={{
        backgroundColor: colours.blue,
        paddingVertical: 7,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
      }}>
      <Text style={{
        color: colours.blue,
        fontSize: _font(13),
      }}>Next</Text>
    </TouchableOpacity>

  );
};
export default Fake;
