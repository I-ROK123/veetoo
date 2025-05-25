import React, { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'px-5 py-4 border-b border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...props }) => {
  return (
    <h3
      className={clsx(
        'text-lg font-semibold text-neutral-800 dark:text-neutral-200',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'px-5 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'px-5 py-3 border-t border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };