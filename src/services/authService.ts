import { getToken } from 'firebase/messaging';
import axios from './axios';
import { UAParser } from "ua-parser-js";
import { messaging } from '../firebase';

// function to collect device info
const getDeviceInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  // نخلي DeviceId ثابت لكل جهاز (يتولد أول مرة وبعدين نخزنه)
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  return {
    os: result.os.name + " " + result.os.version,
    browser: result.browser.name + " " + result.browser.version,
    device: result.device.model || "Desktop",
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    deviceId,
    fcmToken: localStorage.getItem("fcmToken") || null,
  };
};

// login function
export const login = async (username: string, password: string) => {
  // 🔹 Get device info
  const parser = new UAParser();
  const result = parser.getResult();

  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }

  // 🔹 Try to get FCM token
  let fcmToken: string | null = null;
  try {
    fcmToken = await getToken(messaging, {
      vapidKey:
        'BOJEhMwYAch4UmfKjkqDW0Qu1GGpsIlcxN1tdbTfxYwv6AeRFVZEmdHLJ_hlWDeDCIK6x7JdOk5xi6uU0zmvz9c',
    });
    if (fcmToken) {
      localStorage.setItem('fcmToken', fcmToken);
    }
  } catch (err) {
    console.error('Error fetching FCM token:', err);
  }

  // 🔹 Prepare headers
  const headers = {
    'X-FCM-Token': fcmToken || '',
    'X-Device-Id': deviceId,
    'X-Device-OS': result.os.name || '',
    'X-Device-Browser': result.browser.name || '',
    'X-Device-Model': result.device.model || 'Desktop',
  };

  // 🔹 Make login request with headers
  const response = await axios.post(
    '/auth/login',
    { username, password },
    { headers }
  );

  return response.data.data;
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


export const refreshToken = async (token: string) => {
  const response = await axios.post('/auth/refresh', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};