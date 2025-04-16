import { createSlice } from '@reduxjs/toolkit';
import { loginUser, fetchProfile, logoutUser, registerUser } from './authThunks';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.access;
        localStorage.setItem('token', action.payload.access);
      });
  },
  
});

export default authSlice.reducer;
