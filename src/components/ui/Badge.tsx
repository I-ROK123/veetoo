import React, { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/50 dark:text-error-300',
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };
  
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;