import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),
        
      setTheme: (theme) => 
        set({ theme }),
        
      initTheme: () => {
        // Check if user has saved preference
        const savedTheme = get().theme;
        
        // If no saved preference, check system preference
        if (!savedTheme) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ theme: prefersDark ? 'dark' : 'light' });
        }
      },
    }),
    {
      name: 'veetoo-theme',
    }
  )
);