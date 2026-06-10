import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const userService = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en cada petición
userService.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getUsers = async () => {
  const response = await userService.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await userService.delete(`/users/${id}`);
  return response.data;
};

export default userService;
