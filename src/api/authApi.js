import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api/auth' });

// Include access token for protected requests
API.interceptors.request.use((config) => {
  // Skip adding token if config says so
  if (config.skipAuth) {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data) => {
  const res = await API.post('/login/', data, {
    withCredentials: true, // 🔥 allows cookies from server
  });

  // Save access token (from body) and refresh token (from header)
  console.log(res.data);
  localStorage.setItem('accessToken', res.data.access);
  const refreshToken = res.headers['x-refresh-token'];
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  return res.data; // includes user object
};

export const refreshToken = async () => {
  const token = localStorage.getItem('refreshToken');
  const res = await API.post('/refresh-token/',{}, {
    withCredentials: true, // 🔥 allows cookies from server
  });

  const newAccessToken = res.data.access;
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

export const getProfile = async () => {
  const res = await API.get('/me');
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return await API.post('/logout');
};


// Register new user
export const register = async (data) => {
  const res = await API.post('/register/', data, {
    skipAuth: true, // <- magic flag
    withCredentials: true
  });
  localStorage.setItem('accessToken', res.data.access);
  const refreshToken = res.headers['x-refresh-token'];
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  return res.data; // { user }
};

// Forgot password (send email)
export const forgotPassword = async (email) => {
  const res = await API.post('/forgot-password/', { email }, {skipAuth: true});
  return res.data;
};

// Reset password with token
export const resetPassword = async ({uid, token, newPassword }) => {
  const res = await API.post('/reset-password/', { uid ,token, new_password:newPassword },{skipAuth: true});
  return res.data;
};
