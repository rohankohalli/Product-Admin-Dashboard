import axios from 'axios';

/**
 * Shared Axios Instance with Authentication & Centralized Error Handling
 */
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// Request Interceptor: Injects auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dummyjson_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling and session management
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized request. Clearing session.');
      localStorage.removeItem('dummyjson_auth_token');
      localStorage.removeItem('dummyjson_auth_user');

      // Dispatch global event for auth state sync if needed
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    // Standardize human-readable error messages
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default api;
