import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  changeText?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  variant = 'default',
}) => {
  const iconClasses = {
    default: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300',
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300',
    success: 'bg-success-100 text-success-600 dark:bg-success-900/50 dark:text-success-300',
    warning: 'bg-warning-100 text-warning-600 dark:bg-warning-900/50 dark:text-warning-300',
    error: 'bg-error-100 text-error-600 dark:bg-error-900/50 dark:text-error-300',
  };
  
  const changeClasses = {
    positive: 'text-success-600 dark:text-success-400',
    negative: 'text-error-600 dark:text-error-400',
    neutral: 'text-neutral-600 dark:text-neutral-400',
  };
  
  const getChangeClass = () => {
    if (!change) return changeClasses.neutral;
    return change > 0 ? changeClasses.positive : changeClasses.negative;
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{value}</p>
          </div>
          
          {icon && (
            <div className={clsx('p-3 rounded-full', iconClasses[variant])}>
              {icon}
            </div>
          )}
        </div>
        
        {(change !== undefined || changeText) && (
          <div className="mt-3 flex items-center text-sm">
            {change !== undefined && (
              <>
                <span className={clsx('flex items-center', getChangeClass())}>
                  {change > 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(change)}%
                </span>
                <span className="mx-1.5 text-neutral-500 dark:text-neutral-400">•</span>
              </>
            )}
            
            {changeText && (
              <span className="text-neutral-500 dark:text-neutral-400">{changeText}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;