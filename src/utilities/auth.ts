import { jwtDecode } from 'jwt-decode';
// type DecodedToken = {
//   sub: string; // usually the username
//   iat: number;
//   exp: number;
//   roles?: string[]; // if roles are included in token
// };

export const getUserFromToken = (): any | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
