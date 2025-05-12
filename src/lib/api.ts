import { User } from '@/types/user';
import { apiService } from '@/utils/apiService';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const verifyUser = async (token: string): Promise<{message:string, user?:User}> => {
  try {
    const data = await apiService.post<{message:string, user?:User}>('/auth/verify', {token});
    return data;
  } catch (error) {
    throw error;
  }
};