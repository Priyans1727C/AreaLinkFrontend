import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/authApi';

// 🔐 Login Thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await authApi.login(credentials);
      return response; // { user, accessToken }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 👤 Fetch Authenticated User
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      return await authApi.getProfile();
    } catch (err) {
      // If 401, try refreshing token
      if (err.response?.status === 401) {
        try {
          await authApi.refreshToken();
          return await authApi.getProfile(); // Retry
        } catch (refreshError) {
          return thunkAPI.rejectWithValue(refreshError.response.data);
        }
      }
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 🚪 Logout Thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authApi.logout();
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);



// 🔐 Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, thunkAPI) => {
    try {
      const response = await authApi.register(formData); // Contains access token
      await thunkAPI.dispatch(fetchProfile()); // Populate user
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 📧 Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      return await authApi.forgotPassword(email);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// 🔁 Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, thunkAPI) => {
    try {
      return await authApi.resetPassword(data); // { token, password }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
