import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text, Image, ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {images, colours} from '../utils/index';

const Loader = (props) => {


  return (
    <Modal
      isVisible={props.is_visible}
      backdropOpacity={0.3}
      coverScreen={false}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutUp'}
      style={{justifyContent: 'center', alignItems: 'center'}}>
      <View style={{
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        backgroundColor: 'white',
      }}>
        <ActivityIndicator size="large" color={colours.blue}/>
      </View>
    </Modal>

  );
};
export default Loader;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
