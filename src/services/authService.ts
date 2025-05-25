import api from './api';
import { User } from '../types/user';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/user/me');
    return response.data as User;
  },
  
  logout: async () => {
    await api.post('/logout');
    return true;
  }
};