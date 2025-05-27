import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Milk, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../hooks/useAuthStore';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      
      if (!response) {
        throw new Error('Login failed');
      }
      
      // Set auth state
      login(response.user, response.token);
      
      // Show success message
      toast.success(`Welcome back, ${response.user.name}!`);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-50 text-error-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        icon={<Milk className="w-5 h-5 text-neutral-400" />}
        autoComplete="email"
        required
      />
      
      <div className="relative">
        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          icon={<Lock className="w-5 h-5 text-neutral-400" />}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </div>
      
      <div className="text-center text-sm mt-4">
        <p className="text-neutral-500 dark:text-neutral-400">
          For demo purposes, use any of these credentials:
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-primary-600 dark:text-primary-400">
            Salesperson: john@veetoo.com
          </p>
          <p className="text-primary-600 dark:text-primary-400">
            Supervisor: sarah@veetoo.com
          </p>
          <p className="text-primary-600 dark:text-primary-400">
            CEO: grace@veetoo.com
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Password: password
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;