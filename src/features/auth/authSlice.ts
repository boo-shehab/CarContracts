import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  companyUserId: null,
  roles: JSON.parse(localStorage.getItem('roles') || '[]'),
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.companyUserId = action.payload.user?.companyUserId || null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.roles = action.payload.roles;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.roles = [];
      state.isLoading = false;
      localStorage.clear();
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
