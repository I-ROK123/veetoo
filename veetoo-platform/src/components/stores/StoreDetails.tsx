import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { Product } from '../../types/store';
import { storeService } from '../../services/storeService';
import { mockProducts } from '../../utils/mockData/products';

interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
}

interface StoreDetailsProps {
  store: Store;
  onBack: () => void;
  useMockData?: boolean;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ store, onBack, useMockData = false }) => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useMockData) {
      // For mockup, just use all mock products or filter by store.id if needed
      setInventory(mockProducts);
      return;
    }

    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const products = await storeService.getProductsByStore(store.id);
        setInventory(Array.isArray(products) ? products : []);
      } catch {
        setError('Failed to load inventory.');
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [store.id, useMockData]);

  return (
    <div>
      <Button onClick={onBack} className="mb-4">Back to Stores</Button>
      <h2 className="text-xl font-bold mb-2">{store.name} Details</h2>
      <p><strong>Location:</strong> {store.location}</p>
      <p><strong>Manager:</strong> {store.manager}</p>
      <p><strong>Phone:</strong> {store.phone}</p>
      <p><strong>Email:</strong> {store.email}</p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Inventory</h3>
      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Name</th>
              <th className="border border-gray-300 px-2 py-1 text-left">SKU</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Category</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Unit Price</th>
              <th className="border border-gray-300 px-2 py-1 text-right">Quantity In Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(product => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-2 py-1">{product.name}</td>
                <td className="border border-gray-300 px-2 py-1">{product.sku}</td>
                <td className="border border-gray-300 px-2 py-1">{product.category}</td>
                <td className="border border-gray-300 px-2 py-1 text-right">${product.unitPrice.toFixed(2)}</td>
                <td className="border border-gray-300 px-2 py-1 text-right">{product.quantityInStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoreDetails;
