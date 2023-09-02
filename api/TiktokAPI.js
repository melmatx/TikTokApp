import axios from 'axios';
// import {Platform} from 'react-native';

// export const baseURL =
//   Platform.OS === 'android'
//     ? 'http://10.0.2.2:8000/api'
//     : 'http://localhost:8000/api';

export const baseURL = 'http://192.168.100.151/tiktok-api.test/api';

const TiktokAPI = axios.create({
  baseURL,
});

export default TiktokAPI;
