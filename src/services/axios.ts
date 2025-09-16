import axios from 'axios';

// const baseURL = import.meta.env.DEV
//   ? 'https://iqcaradmin.com/api'
//   : 'https://devroot.online/api';
const instance = axios.create({
  baseURL: 'https://devroot.online/api' + '/carcontracts/v1',
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
