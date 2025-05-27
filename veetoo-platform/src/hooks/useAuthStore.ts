import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'salesperson' | 'supervisor' | 'ceo' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      userRole: null,
      token: null,
      
      login: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          userRole: user.role 
        }),
        
      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          userRole: null 
        }),
    }),
    {
      name: 'veetoo-auth',
    }
  )
);