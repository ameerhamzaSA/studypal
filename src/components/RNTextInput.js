import React, {Component} from 'react';
import {TextInput, StyleSheet} from 'react-native';

export default class RNTextInput extends Component {
  render() {
    /* let familyName = 'BerlinSansFBRegular';
    if (this.props.font == '') {
      familyName = 'BerlinSansFBRegular';
    }*/
    var {style, ...other} = this.props;
    return (
      <TextInput style={[style /*{fontFamily: familyName}*/]} {...other} />
    );
  }
}

const styles = StyleSheet.create({
  defaultStyles: {},
});
