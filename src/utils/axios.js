import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://ctms.cfeelearn.com/api/',
  timeout: 5000,
});
export default axiosInstance;
