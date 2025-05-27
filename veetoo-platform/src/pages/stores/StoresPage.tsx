import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import { Search } from 'lucide-react';
import StoreDetails from '../../components/stores/StoreDetails';

interface Store {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
}

const mockStores: Store[] = [
  { id: '1', name: 'Main Street Store', location: '123 Main St', manager: 'Alice Johnson', phone: '555-1234', email: 'alice@example.com' },
  { id: '2', name: 'Downtown Store', location: '456 Downtown Ave', manager: 'Bob Smith', phone: '555-5678', email: 'bob@example.com' },
  { id: '3', name: 'Uptown Store', location: '789 Uptown Blvd', manager: 'Carol Lee', phone: '555-9012', email: 'carol@example.com' },
];

const StoresPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filteredStores = mockStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStore) {
    return (
      <DashboardLayout>
        <StoreDetails store={selectedStore} onBack={() => setSelectedStore(null)} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Stores Management</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Manage your stores and their details</p>
          </div>
          <Button onClick={() => alert('Add store modal would open')}>
            Add Store
          </Button>
        </div>

        <Card>
          <CardContent>
            <InputField
              placeholder="Search by name, location, or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStores.length > 0 ? (
            filteredStores.map(store => (
              <Card key={store.id}>
                <CardHeader>
                  <CardTitle>{store.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Location:</strong> {store.location}</p>
                  <p><strong>Manager:</strong> {store.manager}</p>
                  <p><strong>Phone:</strong> {store.phone}</p>
                  <p><strong>Email:</strong> {store.email}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedStore(store)}>View</Button>
                    <Button size="sm" onClick={() => alert(`Edit store ${store.id}`)}>Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-neutral-600 dark:text-neutral-400">No stores found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoresPage;
