import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const TeamPage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Sales Team</h1>
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Team management features are currently under development.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeamPage;
