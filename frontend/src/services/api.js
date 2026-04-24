import axios from 'axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Token expired or unauthorized
      if (response.status === 401 && !response.config.url.includes('/admin/login')) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please login again.');
      } else if (response.status === 401 && response.config.url.includes('/admin/login')) {
        // Special case for login: just show "Invalid credentials" or similar
        toast.error(response.data?.message || 'Invalid credentials');
      } else {
        const message = response.data?.message || 'Something went wrong';
        toast.error(message);
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
