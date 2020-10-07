import axios from './axios';
import {_alert} from './index';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as CustomNavigation from './service';

export const getPostHeader = async () => {
  try {
    const defaultHeader = {
      'Content-Type': 'multipart/form-data',
    };
    return defaultHeader;
  } catch (error) {
    return defaultHeader;
  }
};

async function AuthFailed() {
  await AsyncStorage.removeItem('user');
  CustomNavigation.navigate('Auth');
}

export const post = async (endpoint, data) => {

  let request;
  let user = await AsyncStorage.getItem('user');
  let parsed = JSON.parse(user);
  const fd = new FormData;
  for (let [key, value] of Object.entries(data)) {
    fd.append(`${key}`, value);
  }
  if (user) {
    fd.append('api_token', parsed.api_token);
  }
  try {
    const requestBody = {
      data: fd,
      url: endpoint,
      method: 'post',
      headers: await getPostHeader(),
    };
    console.log('request', JSON.stringify(requestBody));
    const result = await axios(requestBody);
    //console.log('result', result);
    if (result.status == 200) {
      if (result.data.success) {
        //console.log('re', result.data);
        return {'status': true, 'data': result.data};
      } else {
        //console.log('re', result.data.error);
        return {'status': false, 'message': result.data.error, 'data': []};
      }
    }
  } catch (error) {
    if (error.response.status == 401) {
      AuthFailed();
      return {'status': false, 'message': 'Login session expired', 'data': []};
    } else {
      return {'status': false, 'message': 'Something went wrong', 'data': []};
    }

  }
};
export const post2 = async (endpoint, data) => {
  let request;
  try {
    const requestBody = {
      data: data,
      url: endpoint,
      method: 'post',
      headers: await getPostHeader(),
    };
    //console.log('request', requestBody);
    const result = await axios(requestBody);
    //console.log('result', result);
    if (result.status == 200) {
      if (result.data.success) {
        //console.log('re', result.data);
        return {'status': true, 'data': result.data};
      } else {
        //console.log('re', result.data.error);
        return {'status': false, 'message': result.data.error, 'data': []};
      }
    }
  } catch (error) {
    if (error.response.status == 401) {
      AuthFailed();
      return {'status': false, 'message': 'Login session expired', 'data': []};
    } else {
      return {'status': false, 'message': 'Something went wrong', 'data': []};
    }
  }
};
export const get = async (endpoint) => {
  let request;
  let user = await AsyncStorage.getItem('user');
  let parsed = JSON.parse(user);
  try {

    const requestBody = {
      url: endpoint,
      method: 'get',
    };
    //console.log('request', requestBody);
    const result = await axios(requestBody);
    //console.log('result', result);
    if (result.status == 200) {
      if (result.data.success) {
        //console.log('re', result.data);
        return {'status': true, 'data': result.data};
      } else {
        //console.log('re', result.data.error);
        return {'status': false, 'message': result.data.error, 'data': []};
      }
    }
  } catch (error) {
    if (error.response.status == 401) {
      AuthFailed();
      return {'status': false, 'message': 'Login session expired', 'data': []};
    } else {
      return {'status': false, 'message': 'Something went wrong', 'data': []};
    }
  }
};
