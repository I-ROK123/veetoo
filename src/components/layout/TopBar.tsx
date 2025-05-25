import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useThemeStore } from '../../hooks/useThemeStore';
import toast from 'react-hot-toast';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <div className="h-16 px-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-end bg-white dark:bg-neutral-800">
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        
        {/* Notifications */}
        <button
          type="button"
          className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700 relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>
        
        {/* User menu */}
        <div className="relative">
          <div className="flex items-center space-x-2 p-1 rounded-full cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">{user?.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        
        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;