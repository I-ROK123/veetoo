import { login, signup } from './apiService';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await login({ email, password });
    return response.data;
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone_number?: string;
    region?: string;
  }) => {
    const response = await signup(userData);
    return response.data;
  },

  getCurrentUser: async () => {
    // This is handled by the auth/me endpoint in apiService
    return null as any; // Will be replaced by actual implementation
  },

  logout: () => {
    // Logout is handled client-side by clearing the token
    return Promise.resolve(true);
  }
};