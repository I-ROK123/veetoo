import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  Building,
  BarChart3,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Calendar,
  Download,
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

const CEODashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<CEODashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = ['#0F52BA', '#0E7C7B', '#FF6B35', '#28B45F'];

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
    // Mock export functionality
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
        <div className="h-full flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <div className="text-primary-500 dark:text-primary-400 font-medium text-lg">
              Loading CEO Dashboard...
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Fetching latest business metrics
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Enhanced inventory status data with colors
  const inventoryStatusData = [
    { name: 'Normal', value: stats.inventoryStatus.normal, color: '#28B45F' },
    { name: 'Low Stock', value: stats.inventoryStatus.low, color: '#FFBB00' },
    { name: 'Critical', value: stats.inventoryStatus.critical, color: '#EB2F40' },
  ];

  // Enhanced sales data with additional metrics
  const enhancedSalesData = stats.salesByMonth.map((item, index) => ({
    ...item,
    target: 320000 + (index * 5000), // Mock target data
    growth: index > 0 ? ((item.amount - stats.salesByMonth[index - 1].amount) / stats.salesByMonth[index - 1].amount * 100) : 0
  }));

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
        {/* Enhanced Header - Responsive */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                CEO Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
                Welcome back, <span className="font-semibold text-primary-600 dark:text-primary-400">{user?.name}</span>
              </p>
              <div className="flex items-center mt-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            {/* Action Buttons - Responsive */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                icon={<RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />}
                className="text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
              >
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                icon={<Download className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
              >
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/reports')}
                icon={<BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
              >
                <span className="hidden lg:inline">Detailed Reports</span>
                <span className="lg:hidden">Reports</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Key Performance Indicators - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            icon={<ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />}
            change={stats.salesGrowth}
            variant="primary"
          />
          
          <StatCard
            title="Outstanding Debt"
            value={formatCurrency(stats.totalDebt)}
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
            change={stats.debtChange}
            variant={stats.debtChange > 0 ? 'error' : 'success'}
          />
          
          <StatCard
            title="Inventory Value"
            value={formatCurrency(stats.totalInventoryValue)}
            icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
            change={stats.inventoryChange}
            variant="default"
          />
          
          <StatCard
            title="Bank Deposits"
            value={formatCurrency(stats.bankDeposits)}
            icon={<Building className="w-5 h-5 sm:w-6 sm:h-6" />}
            change={stats.depositsChange}
            variant="success"
          />
        </div>

        {/* Enhanced Monthly Sales Trend - Responsive Chart */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div className="flex-1">
                <CardTitle className="text-lg sm:text-xl">Sales Performance Trend</CardTitle>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Monthly sales vs targets with growth indicators
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-500 rounded-full mr-1 sm:mr-2"></div>
                  <span>Actual Sales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-neutral-300 rounded-full mr-1 sm:mr-2"></div>
                  <span>Target</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={enhancedSalesData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
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
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
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

        {/* Enhanced Charts Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Enhanced Top Products - Responsive */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 p-4 sm:p-6">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-success-600 flex-shrink-0" />
                <span className="truncate">Top Performing Products</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Best sellers by revenue
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.topProducts}
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
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
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

          {/* Enhanced Debt by Region - Responsive */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 p-4 sm:p-6">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-warning-600 flex-shrink-0" />
                <span className="truncate">Regional Debt Distribution</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Outstanding amounts by region
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.debtByRegion}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="region"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {stats.debtByRegion.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), 'Debt']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
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

          {/* Enhanced Inventory Status - Responsive */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-4 sm:p-6">
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600 flex-shrink-0" />
                <span className="truncate">Inventory Health Status</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Stock levels across all products
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {inventoryStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatNumber(value as number), 'Products']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
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
        </div>

        {/* Enhanced Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 sm:p-4">
              <div className="flex items-center text-white">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-primary-100 text-xs sm:text-sm font-medium">Team Overview</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">{stats.salesPersonCount}</p>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Active Salespersons</span>
                <span className="text-sm sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                  {stats.salesPersonCount - stats.flaggedSalesPersons}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-error-600 dark:text-error-400 flex items-center">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span>Flagged</span>
                </span>
                <span className="text-sm sm:text-lg font-semibold text-error-600 dark:text-error-400">
                  {stats.flaggedSalesPersons}
                </span>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className={`bg-gradient-to-r p-3 sm:p-4 ${
              stats.salesGrowth >= 0 
                ? 'from-success-500 to-success-600' 
                : 'from-error-500 to-error-600'
            }`}>
              <div className="flex items-center text-white">
                {stats.salesGrowth >= 0 ? (
                  <ArrowUp className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                ) : (
                  <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white/80 text-xs sm:text-sm font-medium">Sales Growth</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">{stats.salesGrowth.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Performance vs last month
                </p>
                <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  stats.salesGrowth >= 10 
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                    : stats.salesGrowth >= 0
                    ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                }`}>
                  {stats.salesGrowth >= 10 ? 'Excellent' : stats.salesGrowth >= 0 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 md:col-span-2 xl:col-span-1">
            <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-3 sm:p-4">
              <div className="flex items-center text-white">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-secondary-100 text-xs sm:text-sm font-medium">Inventory Health</p>
                  <p className="text-xl sm:text-2xl font-bold truncate">
                    {stats.inventoryStatus.normal + stats.inventoryStatus.low + stats.inventoryStatus.critical}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs font-medium rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success-500 rounded-full mr-1"></div>
                    Normal
                  </span>
                  <span className="font-semibold text-sm">{stats.inventoryStatus.normal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 text-xs font-medium rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-warning-500 rounded-full mr-1"></div>
                    Low Stock
                  </span>
                  <span className="font-semibold text-sm">{stats.inventoryStatus.low}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 text-xs font-medium rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-error-500 rounded-full mr-1"></div>
                    Critical
                  </span>
                  <span className="font-semibold text-sm">{stats.inventoryStatus.critical}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CEODashboard;