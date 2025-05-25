import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { reportService } from '../../services/reportService';
import { useAuthStore } from '../../hooks/useAuthStore';
import { SalesDashboardStats } from '../../types/report';
import { formatCurrency } from '../../utils/formatters';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Receipt, 
  CheckCircle, 
  AlertTriangle,
  Wallet,
  PiggyBank
} from 'lucide-react';

const SalespersonDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SalesDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportService.getDashboardStats('salesperson', user?.id);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const getInvoiceStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-warning-100 text-warning-800', label: 'Pending' },
      approved: { color: 'bg-primary-100 text-primary-800', label: 'Approved' },
      cleared: { color: 'bg-success-100 text-success-800', label: 'Cleared' },
      rejected: { color: 'bg-error-100 text-error-800', label: 'Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: 'bg-neutral-100 text-neutral-800', label: status };
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'No data available'}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Sales Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Welcome back, {user?.name}! Here's your sales overview.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="flex flex-col border-l-4 border-l-primary-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <DollarSign className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Sales</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{formatCurrency(stats.totalSales)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col border-l-4 border-l-error-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-error-100 dark:bg-error-900/30 rounded-full">
                <Wallet className="w-6 h-6 text-error-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Debt</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{formatCurrency(stats.totalDebt)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col border-l-4 border-l-success-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-success-100 dark:bg-success-900/30 rounded-full">
                <PiggyBank className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Daily Savings</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{formatCurrency(stats.dailySavings)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col border-l-4 border-l-warning-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-warning-100 dark:bg-warning-900/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Net Debt</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{formatCurrency(stats.netDebt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(stats.recentInvoices || []).map((invoice) => (
                    <TableRow 
                      key={invoice.id}
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getInvoiceStatusBadge(invoice.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Weekly Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.salesByWeek || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `KES ${value/1000}k`}
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
                      dataKey="amount" 
                      fill="#0F52BA" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="flex flex-col border-l-4 border-l-warning-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-warning-100 dark:bg-warning-900/30 rounded-full">
                <Clock className="w-6 h-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pending Invoices</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{stats.pendingInvoices}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col border-l-4 border-l-primary-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <Receipt className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Approved Invoices</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{stats.approvedInvoices}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col border-l-4 border-l-success-500">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 p-3 bg-success-100 dark:bg-success-900/30 rounded-full">
                <CheckCircle className="w-6 h-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Cleared Invoices</p>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">{stats.clearedInvoices}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debt Alert */}
        {stats.isFlagged && (
          <Card className="bg-error-50 dark:bg-error-900/20 border-error-300 dark:border-error-800">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-error-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-error-700 dark:text-error-400">Debt Warning</h3>
                  <p className="text-error-600 dark:text-error-300">
                    Your debt has exceeded the threshold. Please make additional payments to bring it under control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SalespersonDashboard;