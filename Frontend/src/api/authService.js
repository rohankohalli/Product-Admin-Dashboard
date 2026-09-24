import api from './axiosInstance';

/**
 * Authentication service functions using centralized Axios instance
 */

export async function loginUser(username, password) {
  const response = await api.post('/auth/login', {
    username,
    password,
    expiresInMins: 120,
  });

  const data = response.data;
  const token = data.accessToken || data.token;

  if (token) {
    localStorage.setItem('dummyjson_auth_token', token);
    localStorage.setItem('dummyjson_auth_user', JSON.stringify(data));
  }

  return data;
}

export async function getProfile() {
  const response = await api.get('/auth/me');
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem('dummyjson_auth_token');
  localStorage.removeItem('dummyjson_auth_user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('dummyjson_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('dummyjson_auth_token');
}
