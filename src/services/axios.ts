import axios from 'axios';

// const baseURL = import.meta.env.DEV
//   ? '/api'
//   : 'https://209.127.228.55:8082/api';
const instance = axios.create({
  baseURL: 'http://209.127.228.55:8082/api' + '/carcontracts/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
