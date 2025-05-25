import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle,
  Building, 
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { reportService } from '../../services/reportService';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { SupervisorDashboardStats } from '../../types/report';
import { useAuthStore } from '../../hooks/useAuthStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SupervisorDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ['#0F52BA', '#0E7C7B', '#FF6B35', '#28B45F'];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const data = await reportService.getDashboardStats('supervisor', user?.id);
        setStats(data as SupervisorDashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user?.id]);

  if (isLoading || !stats) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse-slow text-primary-500 dark:text-primary-400">
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Supervisor Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/reports')}
              icon={<BarChart3 className="w-4 h-4" />}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            icon={<ShoppingBag className="w-6 h-6" />}
            variant="primary"
          />
          
          <StatCard
            title="Sales Team"
            value={stats.salesPersonCount}
            icon={<Users className="w-6 h-6" />}
            changeText={`${stats.flaggedSalesPersons} flagged`}
            variant={stats.flaggedSalesPersons > 0 ? 'warning' : 'success'}
          />
          
          <StatCard
            title="Inventory"
            value={stats.totalProducts}
            icon={<Package className="w-6 h-6" />}
            changeText={`${stats.lowStockProducts} low stock`}
            variant={stats.lowStockProducts > 0 ? 'warning' : 'success'}
          />
          
          <StatCard
            title="Bank Deposits"
            value={formatCurrency(stats.bankDeposits)}
            icon={<Building className="w-6 h-6" />}
            variant="success"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.salesByRegion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="region"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {stats.salesByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), 'Sales']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Salespersons */}
          <Card>
            <CardHeader>
              <CardTitle>Top Salespersons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.topSalesPersons}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `KES ${value/1000}k`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Sales']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <Bar 
                      dataKey="sales" 
                      fill="#0F52BA" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inventory Status</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/store')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.productPerformance.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">
                        <span 
                          className={
                            product.quantity < 30 
                              ? 'text-error-600 dark:text-error-400' 
                              : product.quantity < 50 
                                ? 'text-warning-600 dark:text-warning-400' 
                                : 'text-success-600 dark:text-success-400'
                          }
                        >
                          {formatNumber(product.quantity)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.pendingInvoices > 0 && (
                  <div className="flex items-center p-3 bg-warning-50 dark:bg-warning-900/20 rounded-md border border-warning-200 dark:border-warning-800">
                    <AlertTriangle className="w-5 h-5 text-warning-500 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-warning-700 dark:text-warning-400 font-medium">
                        {stats.pendingInvoices} invoices pending approval
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/invoices?status=pending')}
                    >
                      Review
                    </Button>
                  </div>
                )}
                
                {stats.lowStockProducts > 0 && (
                  <div className="flex items-center p-3 bg-error-50 dark:bg-error-900/20 rounded-md border border-error-200 dark:border-error-800">
                    <AlertTriangle className="w-5 h-5 text-error-500 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-error-700 dark:text-error-400 font-medium">
                        {stats.lowStockProducts} products low in stock
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/store?filter=low')}
                    >
                      Check
                    </Button>
                  </div>
                )}
                
                {stats.flaggedSalesPersons > 0 && (
                  <div className="flex items-center p-3 bg-error-50 dark:bg-error-900/20 rounded-md border border-error-200 dark:border-error-800">
                    <AlertTriangle className="w-5 h-5 text-error-500 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-error-700 dark:text-error-400 font-medium">
                        {stats.flaggedSalesPersons} salespersons with high debt
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/team?filter=flagged')}
                    >
                      Review
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700">
                  <Building className="w-5 h-5 text-neutral-500 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Record today's bank deposit
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/banking/deposit')}
                  >
                    Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;