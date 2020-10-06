import React, {Component} from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {images, _font, WIDTH,colours} from '../utils';

class CustomHeader extends Component {
  render() {
    return (
      <View style={{
        height: 55,
        width: WIDTH,
        backgroundColor: colours.blue,
        flexDirection: 'row',
      }}>
        <View style={{}}>
          {this.props.leftComponent ? this.props.leftComponent : null}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', width: WIDTH - 120}}>
          {this.props.middleComponent ? this.props.middleComponent : null}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', width: 60}}>
          {this.props.rightComponent ? this.props.rightComponent : null}
        </View>
      </View>
    );
  }
}

export default CustomHeader;
