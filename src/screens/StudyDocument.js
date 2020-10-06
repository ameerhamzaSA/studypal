import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Text from '../components/RNText';
import {images, colours, _font, WIDTH, HEIGHT} from '../utils/index';
import RNFetchBlob from 'rn-fetch-blob';

const Document = (props) => {
  const item = props.item;
  const download = (path) => {
    //console.log(path);
    const dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob
      .config({
        path: dirs.DCIMDir,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
        },
        fileCache: true,
      })
      .fetch('GET', path, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        //console.log('The file saved to ', res.path());
      });
  };
  return (
    <View style={{
      height: 60,
      width: '100%',
      borderColor: 'lightgrey',
      borderWidth: 1,
      marginTop: 10,
      flexDirection: 'row',
    }}>
      <View style={{width: '85%', justifyContent: 'center'}}>
        <Text style={{marginLeft: 5, color: 'grey'}}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => download(item.mobile_download_path)} style={{
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
