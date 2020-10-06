import {ToastAndroid, Platform, Dimensions, PixelRatio} from 'react-native';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const images = {
  'login_logo': require('./images/login_logo.png'),
  'close': require('./images/close.png'),
  'tick': require('./images/tick.png'),
  'back_white': require('./images/back_white.png'),
  'pencil': require('./images/pencil.png'),
  'profile': require('./images/profile.jpeg'),
  'logout': require('./images/logout.png'),
  'bell': require('./images/bell.png'),
  'dashboard': require('./images/dashboard.png'),
  'down_arrow': require('./images/down_arrow.png'),
  'menu': require('./images/menu.png'),
  'filter': require('./images/filter.png'),
  'right_arrow': require('./images/right_arrow.png'),
  'login': require('./images/login.png'),
  'splash_bg': require('./images/splash_bg.png'),
  'checked': require('./images/checked.png'),
  'check': require('./images/check.png'),
  'unchecked': require('./images/unchecked.png'),
  'uncheck': require('./images/uncheck.png'),
  'global': require('./images/global.png'),
  'plus': require('./images/plus.png'),
  'refresh': require('./images/refresh.png'),
  'default': require('./images/default.jpeg'),
};
const colours = {
  'white': 'white',
  'black': '#303030',
  'blue': '#2699FB',
  'lightblue': '#BCDEFE',
  'green': '#00E676',
  'red': '#DD2C00',
  'brown': '#FFAB00',
};

function _alert(string) {
  if (Platform.OS == 'ios') {
    alert(string);
  } else {
    ToastAndroid.showWithGravity(
      string,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  }

}

function _toast(string) {
  if (Platform.OS == 'ios') {
    alert(string);
  } else {
    ToastAndroid.showWithGravity(
      string,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  }

}

function _font(size) {
  const scale = SCREEN_WIDTH / 320;
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

function _truncateText(limit = 17, text) {
  return text.length > limit ? `${text.substr(0, limit)}...` : text;
}

function _log(string) {
  //console.log(string);
}


module.exports = {
  images: images,
  colours: colours,
  _font: _font,
  _alert: _alert,
  _toast: _toast,
  _log: _log,
  _truncateText: _truncateText,
  WIDTH: Dimensions.get('window').width,
  HEIGHT: Dimensions.get('window').height,
};
