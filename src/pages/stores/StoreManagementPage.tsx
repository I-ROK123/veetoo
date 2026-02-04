import React, { useState, useEffect } from 'react';
import { Store, Plus, MapPin, Phone, User } from 'lucide-react';
import { storeService } from '../../services/storeService';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import DataTable from '../../components/ui/DataTable';
import toast from 'react-hot-toast';

const StoreManagementPage: React.FC = () => {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<any>(null);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            const data = await storeService.getStores();
            setStores(data);
        } catch (error) {
            toast.error('Failed to load stores');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = () => {
        setSelectedStore(null);
        setIsModalOpen(true);
    };

    const handleEditStore = (store: any) => {
        setSelectedStore(store);
        setIsModalOpen(true);
    };

    const columns = [
        {
            key: 'name',
            label: 'Store Name',
            sortable: true,
            render: (store: any) => (
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{store.name}</span>
                </div>
            )
        },
        {
            key: 'location',
            label: 'Location',
            sortable: true,
            render: (store: any) => (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{store.location}</span>
                </div>
            )
        },
        {
            key: 'phone_number',
            label: 'Phone',
            render: (store: any) => (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone_number || 'N/A'}</span>
                </div>
            )
        },
        {
            key: 'manager',
            label: 'Manager',
            render: (store: any) => (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{store.manager?.name || 'Unassigned'}</span>
                </div>
            )
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (store: any) => (
                <StatusBadge status={store.is_active ? 'active' : 'cancelled'} size="sm" />
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading stores...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your store locations and inventory
                    </p>
                </div>
                <button
                    onClick={handleCreateStore}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Store
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Stores</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stores.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Stores</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                        {stores.filter(s => s.is_active).length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Inactive Stores</div>
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                        {stores.filter(s => !s.is_active).length}
                    </div>
                </div>
            </div>

            {/* Stores Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <DataTable
                    data={stores}
                    columns={columns}
                    keyExtractor={(store) => store.id}
                    onRowClick={handleEditStore}
                    searchable
                    searchPlaceholder="Search stores..."
                />
            </div>

            {/* Store Form Modal */}
            {isModalOpen && (
                <StoreFormModal
                    store={selectedStore}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        loadStores();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

// Store Form Modal Component
const StoreFormModal: React.FC<{
    store: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ store, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: store?.name || '',
        location: store?.location || '',
        phone_number: store?.phone_number || '',
        manager_id: store?.manager_id || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (store) {
                await storeService.updateStore(store.id, formData);
                toast.success('Store updated successfully');
            } else {
                await storeService.createStore(formData);
                toast.success('Store created successfully');
            }
            onSuccess();
        } catch (error) {
            toast.error('Failed to save store');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={store ? 'Edit Store' : 'Create New Store'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Store Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Main Warehouse"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location *
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main St, City"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="+1234567890"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default StoreManagementPage;
