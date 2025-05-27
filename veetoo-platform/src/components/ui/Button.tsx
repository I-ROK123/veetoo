import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm dark:bg-secondary-600 dark:hover:bg-secondary-700',
    outline: 'border border-neutral-300 hover:bg-neutral-50 text-neutral-700 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
    ghost: 'hover:bg-neutral-100 text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
    danger: 'bg-error-500 hover:bg-error-600 text-white shadow-sm dark:bg-error-600 dark:hover:bg-error-700',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
  };
  
  return (
    <button
      className={clsx(
        'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 inline-flex items-center justify-center',
        variantClasses[variant],
        sizeClasses[size],
        disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;