import axios from './axios';

export const login = async (username: string, password: string) => {
  const response = await axios.post('/auth/login', { username, password });
  return response.data;
};
export const getMe = async (token: string) => {
  const response = await axios.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('roles');
  localStorage.removeItem('user');
};
