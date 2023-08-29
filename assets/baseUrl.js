import {Platform} from 'react-native';

export const baseUrl =
  (Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost') +
  ':8000/api';
