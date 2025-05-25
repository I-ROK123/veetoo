import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Milk } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
            <Milk className="w-7 h-7 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          VeeToo
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400 max-w">
          Brookside Distributor Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-neutral-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;