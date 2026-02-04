import React, { useState, useEffect } from 'react';
import { Store, ChevronDown } from 'lucide-react';
import { storeService } from '../../services/storeService';

interface StoreSelectorProps {
    value?: string;
    onChange: (storeId: string) => void;
    label?: string;
    placeholder?: string;
    allowAll?: boolean;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
    value,
    onChange,
    label = 'Select Store',
    placeholder = 'Choose a store...',
    allowAll = false
}) => {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            const data = await storeService.getStores();
            setStores(data);
        } catch (error) {
            console.error('Failed to load stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedStore = stores.find(s => s.id === value);

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                        {loading ? 'Loading...' : selectedStore ? selectedStore.name : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && !loading && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {allowAll && (
                            <button
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="text-gray-900 dark:text-white font-medium">All Stores</span>
                            </button>
                        )}
                        {stores.map((store) => (
                            <button
                                key={store.id}
                                onClick={() => {
                                    onChange(store.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${value === store.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-900 dark:text-white font-medium">{store.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{store.location}</div>
                                    </div>
                                    {store.is_active && (
                                        <span className="text-xs text-green-600 dark:text-green-400">●</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StoreSelector;
