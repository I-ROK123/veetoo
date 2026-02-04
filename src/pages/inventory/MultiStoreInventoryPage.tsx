import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { storeService } from '../../services/storeService';
import StoreSelector from '../../components/ui/StoreSelector';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const MultiStoreInventoryPage: React.FC = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showLowStock, setShowLowStock] = useState(false);
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [selectedStore, showLowStock]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [inventoryData, storesData] = await Promise.all([
                showLowStock
                    ? inventoryService.getLowStock()
                    : selectedStore
                        ? inventoryService.getInventoryByStore(selectedStore)
                        : inventoryService.getInventory(),
                storeService.getStores()
            ]);
            setInventory(inventoryData);
            setStores(storesData);
        } catch (error) {
            toast.error('Failed to load inventory');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustStock = (item: any) => {
        setSelectedItem(item);
        setAdjustModalOpen(true);
    };

    const totalValue = inventory.reduce((sum, item) => {
        return sum + (item.quantity_in_stock * (item.Product?.unit_price || 0));
    }, 0);

    const lowStockCount = inventory.filter(
        item => item.quantity_in_stock <= item.reorder_level
    ).length;

    const columns = [
        {
            key: 'product',
            label: 'Product',
            sortable: true,
            render: (item: any) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {item.Product?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        SKU: {item.Product?.sku || 'N/A'}
                    </div>
                </div>
            )
        },
        {
            key: 'store',
            label: 'Store',
            sortable: true,
            render: (item: any) => (
                <span className="text-gray-900 dark:text-white">
                    {item.Store?.name || 'Unknown'}
                </span>
            )
        },
        {
            key: 'quantity_in_stock',
            label: 'Stock',
            sortable: true,
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <span className={`font-semibold ${item.quantity_in_stock <= item.reorder_level
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                        {item.quantity_in_stock}
                    </span>
                    {item.quantity_in_stock <= item.reorder_level && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                </div>
            )
        },
        {
            key: 'reorder_level',
            label: 'Reorder Level',
            sortable: true,
            render: (item: any) => (
                <span className="text-gray-600 dark:text-gray-400">
                    {item.reorder_level}
                </span>
            )
        },
        {
            key: 'value',
            label: 'Value',
            render: (item: any) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    ${((item.quantity_in_stock * (item.Product?.unit_price || 0))).toFixed(2)}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item: any) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAdjustStock(item);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Adjust
                </button>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading inventory...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Multi-Store Inventory</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track inventory across all store locations
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Package className="w-4 h-4" />
                        Total Items
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{inventory.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        Total Value
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${totalValue.toFixed(2)}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        Low Stock Items
                    </div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <ArrowRightLeft className="w-4 h-4" />
                        Stores
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stores.length}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StoreSelector
                        value={selectedStore}
                        onChange={setSelectedStore}
                        label="Filter by Store"
                        allowAll
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Stock Level
                        </label>
                        <button
                            onClick={() => setShowLowStock(!showLowStock)}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${showLowStock
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {showLowStock ? 'Showing Low Stock Only' : 'Show All Stock'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <DataTable
                    data={inventory}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    searchable
                    searchPlaceholder="Search products..."
                />
            </div>

            {/* Stock Adjustment Modal */}
            {adjustModalOpen && selectedItem && (
                <StockAdjustmentModal
                    item={selectedItem}
                    isOpen={adjustModalOpen}
                    onClose={() => {
                        setAdjustModalOpen(false);
                        setSelectedItem(null);
                    }}
                    onSuccess={() => {
                        loadData();
                        setAdjustModalOpen(false);
                        setSelectedItem(null);
                    }}
                />
            )}
        </div>
    );
};

// Stock Adjustment Modal
const StockAdjustmentModal: React.FC<{
    item: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ item, isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        quantity: 0,
        type: 'in' as 'in' | 'out',
        notes: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await inventoryService.adjustInventory({
                store_id: item.store_id,
                product_id: item.product_id,
                quantity: formData.quantity,
                type: formData.type,
                notes: formData.notes
            });
            toast.success('Stock adjusted successfully');
            onSuccess();
        } catch (error) {
            toast.error('Failed to adjust stock');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adjust Stock" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Product</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.Product?.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Current Stock: {item.quantity_in_stock}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'in' })}
                            className={`px-4 py-2 rounded-lg border transition-colors ${formData.type === 'in'
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Stock In
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'out' })}
                            className={`px-4 py-2 rounded-lg border transition-colors ${formData.type === 'out'
                                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Stock Out
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity *
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Reason for adjustment..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Adjust Stock'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MultiStoreInventoryPage;
