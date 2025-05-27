import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Building,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Area, AreaChart } from 'recharts';
import { reportService } from '../../services/reportService';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { CEODashboardStats } from '../../types/report';
import { useAuthStore } from '../../hooks/useAuthStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Types for chart data
interface EnhancedSalesData {
  month: string;
  amount: number;
  target: number;
  growth: number;
}

interface InventoryStatusData {
  name: string;
  value: number;
  color: string;
}

interface TopProductData {
  name: string;
  sales: number;
}

interface DebtRegionData {
  region: string;
  amount: number;
}

interface ChartProps {
  tooltipStyle: Record<string, unknown>;
}

interface SalesTrendChartProps extends ChartProps {
  data: EnhancedSalesData[];
}

interface TopProductsChartProps extends ChartProps {
  data: TopProductData[];
}

interface DebtDistributionChartProps extends ChartProps {
  data: DebtRegionData[];
  colors: string[];
}

interface InventoryStatusChartProps extends ChartProps {
  data: InventoryStatusData[];
}

// Loading Spinner Component
const LoadingSpinner: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
  </div>
);

// Constants for better maintainability
const CHART_COLORS = ['#0F52BA', '#0E7C7B', '#FF6B35', '#28B45F'];
const INVENTORY_STATUS_COLORS = {
  normal: '#28B45F',
  low: '#FFBB00',
  critical: '#EB2F40'
};

const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<CEODashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reportService.getDashboardStats('ceo', user?.id);
      setStats(data as CEODashboardStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!stats) return;
    
    const dataStr = JSON.stringify(stats, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ceo-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading || !stats) {
    return (
      <DashboardLayout>
        <LoadingSpinner 
          title="Loading Reports..."
          subtitle="Fetching latest business metrics"
        />
      </DashboardLayout>
    );
  }

  // Data transformations
  const inventoryStatusData: InventoryStatusData[] = [
    { name: 'Normal', value: stats.inventoryStatus.normal, color: INVENTORY_STATUS_COLORS.normal },
    { name: 'Low Stock', value: stats.inventoryStatus.low, color: INVENTORY_STATUS_COLORS.low },
    { name: 'Critical', value: stats.inventoryStatus.critical, color: INVENTORY_STATUS_COLORS.critical },
  ];

  const enhancedSalesData: EnhancedSalesData[] = stats.salesByMonth.map((item, index) => ({
    ...item,
    target: 320000 + (index * 5000), // Mock target data
    growth: index > 0 
      ? ((item.amount - stats.salesByMonth[index - 1].amount) / stats.salesByMonth[index - 1].amount * 100) 
      : 0
  }));

  // Tooltip styling for consistency
  const tooltipStyle: Record<string, unknown> = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '12px'
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Executive Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive overview of business performance</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportData}
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            icon={<ShoppingBag className="w-5 h-5" />}
            change={stats.salesGrowth}
            variant="primary"
          />
          
          <StatCard
            title="Outstanding Debt"
            value={formatCurrency(stats.totalDebt)}
            icon={<TrendingUp className="w-5 h-5" />}
            change={stats.debtChange}
            variant={stats.debtChange > 0 ? 'error' : 'success'}
          />
          
          <StatCard
            title="Inventory Value"
            value={formatCurrency(stats.totalInventoryValue)}
            icon={<Package className="w-5 h-5" />}
            change={stats.inventoryChange}
            variant="default"
          />
          
          <StatCard
            title="Bank Deposits"
            value={formatCurrency(stats.bankDeposits)}
            icon={<Building className="w-5 h-5" />}
            change={stats.depositsChange}
            variant="success"
          />
        </div>

        {/* Sales Trend Chart */}
        <SalesTrendChart data={enhancedSalesData} tooltipStyle={tooltipStyle} />

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <TopProductsChart 
            data={stats.topProducts} 
            tooltipStyle={tooltipStyle} 
          />
          
          <DebtDistributionChart 
            data={stats.debtByRegion} 
            colors={CHART_COLORS}
            tooltipStyle={tooltipStyle} 
          />
          
          <InventoryStatusChart 
            data={inventoryStatusData} 
            tooltipStyle={tooltipStyle} 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Extracted chart components for better readability and reusability

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data, tooltipStyle }) => (
  <Card className="mb-6">
    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6">
      <CardTitle className="text-lg">Sales Performance Trend</CardTitle>
      <p className="text-sm text-muted-foreground">
        Monthly sales vs targets with growth indicators
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0F52BA" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value/1000}k`}
              width={40}
            />
            <Tooltip 
              formatter={(value, name) => [
                formatCurrency(value as number), 
                name === 'amount' ? 'Actual Sales' : 'Target'
              ]}
              contentStyle={tooltipStyle}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#0F52BA" 
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={{ r: 3, fill: '#0F52BA' }}
              activeDot={{ r: 5, fill: '#0F52BA' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, tooltipStyle }) => (
  <Card>
    <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6">
      <CardTitle className="flex items-center">
        <Package className="w-5 h-5 mr-2 text-green-600" />
        <span>Top Performing Products</span>
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Best sellers by revenue
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value/1000}k`}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              width={80}
              tick={{ fontSize: 9 }}
              tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Sales']}
              contentStyle={tooltipStyle}
            />
            <Bar 
              dataKey="sales" 
              fill="#28B45F" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const DebtDistributionChart: React.FC<DebtDistributionChartProps> = ({ data, colors, tooltipStyle }) => (
  <Card>
    <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6">
      <CardTitle className="flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
        <span>Regional Debt Distribution</span>
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Outstanding amounts by region
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="amount"
              nameKey="region"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatCurrency(value as number), 'Debt']}
              contentStyle={tooltipStyle}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const InventoryStatusChart: React.FC<InventoryStatusChartProps> = ({ data, tooltipStyle }) => (
  <Card>
    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6">
      <CardTitle className="flex items-center">
        <Package className="w-5 h-5 mr-2 text-blue-600" />
        <span>Inventory Health Status</span>
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Stock levels across all products
      </p>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatNumber(value as number), 'Products']}
              contentStyle={tooltipStyle}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default ReportsPage;