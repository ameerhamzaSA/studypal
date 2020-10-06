import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';

export default class RNText extends Component {
  render() {
    /*let familyName = 'BerlinSansFBRegular';
    if (this.props.font == '') {
      familyName = 'BerlinSansFBRegular';
    }*/
    return (
      <Text style={[this.props.style /*{fontFamily: familyName}*/]}>
        {this.props.children}
      </Text>
    );
  }
}
