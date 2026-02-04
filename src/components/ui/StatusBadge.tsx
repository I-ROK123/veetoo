import React from 'react';

interface StatusBadgeProps {
    status: 'pending' | 'approved' | 'cleared' | 'rejected' | 'in_transit' | 'completed' | 'cancelled' | 'paid' | 'overdue' | 'active';
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
    const getStatusConfig = () => {
        const configs = {
            pending: {
                bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                text: 'text-yellow-800 dark:text-yellow-300',
                border: 'border-yellow-300 dark:border-yellow-700',
                icon: '⏳',
                label: 'Pending'
            },
            approved: {
                bg: 'bg-blue-100 dark:bg-blue-900/30',
                text: 'text-blue-800 dark:text-blue-300',
                border: 'border-blue-300 dark:border-blue-700',
                icon: '✓',
                label: 'Approved'
            },
            cleared: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-800 dark:text-green-300',
                border: 'border-green-300 dark:border-green-700',
                icon: '✓✓',
                label: 'Cleared'
            },
            rejected: {
                bg: 'bg-red-100 dark:bg-red-900/30',
                text: 'text-red-800 dark:text-red-300',
                border: 'border-red-300 dark:border-red-700',
                icon: '✗',
                label: 'Rejected'
            },
            in_transit: {
                bg: 'bg-purple-100 dark:bg-purple-900/30',
                text: 'text-purple-800 dark:text-purple-300',
                border: 'border-purple-300 dark:border-purple-700',
                icon: '🚚',
                label: 'In Transit'
            },
            completed: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-800 dark:text-green-300',
                border: 'border-green-300 dark:border-green-700',
                icon: '✓',
                label: 'Completed'
            },
            cancelled: {
                bg: 'bg-gray-100 dark:bg-gray-900/30',
                text: 'text-gray-800 dark:text-gray-300',
                border: 'border-gray-300 dark:border-gray-700',
                icon: '⊘',
                label: 'Cancelled'
            },
            paid: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-800 dark:text-green-300',
                border: 'border-green-300 dark:border-green-700',
                icon: '💰',
                label: 'Paid'
            },
            overdue: {
                bg: 'bg-red-100 dark:bg-red-900/30',
                text: 'text-red-800 dark:text-red-300',
                border: 'border-red-300 dark:border-red-700',
                icon: '⚠',
                label: 'Overdue'
            },
            active: {
                bg: 'bg-green-100 dark:bg-green-900/30',
                text: 'text-green-800 dark:text-green-300',
                border: 'border-green-300 dark:border-green-700',
                icon: '●',
                label: 'Active'
            }
        };

        return configs[status] || configs.pending;
    };

    const config = getStatusConfig();

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}
      `}
        >
            {showIcon && <span className="text-xs">{config.icon}</span>}
            <span>{config.label}</span>
        </span>
    );
};

export default StatusBadge;
