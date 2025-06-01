export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRoles = () => JSON.parse(localStorage.getItem('roles') || '[]');
export const isLoggedIn = () => Boolean(getAccessToken());
export const isSuperAdmin = () => getRoles().includes('ROLE_SUPER_ADMIN');
