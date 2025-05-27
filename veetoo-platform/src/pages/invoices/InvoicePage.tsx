import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  DollarSign,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import InputField from '../../components/ui/InputField';
import { invoiceService } from '../../services/invoiceService';
import { useAuthStore } from '../../hooks/useAuthStore';
import { Invoice, InvoiceStatus } from '../../types/invoice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { mockInvoices } from '../../utils/mockData/invoices';

interface InvoiceFilters {
  status: InvoiceStatus | 'all';
  dateFrom: string;
  dateTo: string;
  salesperson: string;
  minAmount: string;
  maxAmount: string;
}

const InvoicePage: React.FC = () => {
  const { user, userRole } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    salesperson: '',
    minAmount: '',
    maxAmount: ''
  });

  // Fetch invoices based on user role
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Invoice[];
      
      if (userRole === 'salesperson') {
        // Salesperson sees only their invoices
        data = await invoiceService.getInvoicesBySalesperson(user?.id || '');
      } else {
        // Supervisors and CEOs see all invoices
        // For now, using mock data - in real app, would call getAllInvoices
        data = mockInvoices;
      }
      
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      setError('Failed to load invoices');
      // Fallback to mock data
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
    } finally {
      setLoading(false);
    }
  }, [user?.id, userRole]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Apply filters and search
  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.salesPersonName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(invoice => 
        new Date(invoice.date) <= new Date(filters.dateTo)
      );
    }

    // Salesperson filter (for supervisors/CEOs)
    if (filters.salesperson && userRole !== 'salesperson') {
      filtered = filtered.filter(invoice => 
        invoice.salesPersonName.toLowerCase().includes(filters.salesperson.toLowerCase())
      );
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(invoice => 
        invoice.amount >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(invoice => 
        invoice.amount <= parseFloat(filters.maxAmount)
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, filters, userRole]);

  const getStatusBadge = (status: InvoiceStatus) => {
    const statusConfig = {
      pending: { 
        color: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400', 
        icon: Clock,
        label: 'Pending' 
      },
      approved: { 
        color: 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400', 
        icon: CheckCircle,
        label: 'Approved' 
      },
      cleared: { 
        color: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400', 
        icon: CheckCircle,
        label: 'Cleared' 
      },
      rejected: { 
        color: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400', 
        icon: XCircle,
        label: 'Rejected' 
      }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getInvoiceStats = () => {
    const stats = {
      total: invoices.length,
      pending: invoices.filter(inv => inv.status === 'pending').length,
      approved: invoices.filter(inv => inv.status === 'approved').length,
      cleared: invoices.filter(inv => inv.status === 'cleared').length,
      rejected: invoices.filter(inv => inv.status === 'rejected').length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0)
    };
    return stats;
  };

  const stats = getInvoiceStats();

  const handleApproveInvoice = async (invoiceId: string) => {
    try {
      await invoiceService.approveInvoice(invoiceId);
      await fetchInvoices();
    } catch (err) {
      console.error('Failed to approve invoice:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse space-y-2 w-full max-w-lg px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Invoice Management
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {userRole === 'salesperson' 
                ? 'Manage your invoices and payments'
                : 'Oversee all invoice operations'
              }
            </p>
          </div>
          
          <div className="flex gap-2">
            {userRole === 'salesperson' && (
              <Button 
                onClick={() => console.log('Upload modal would open here')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload Invoice
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
                  <Clock className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Approved</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.approved}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Cleared</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.cleared}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-error-100 dark:bg-error-900/20 rounded-lg">
                  <XCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Rejected</p>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Value</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <InputField
                    placeholder="Search by invoice number or salesperson..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as InvoiceStatus | 'all' }))}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="cleared">Cleared</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <InputField
                    label="Date From"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />

                  <InputField
                    label="Date To"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />

                  {userRole !== 'salesperson' && (
                    <InputField
                      label="Salesperson"
                      placeholder="Filter by salesperson"
                      value={filters.salesperson}
                      onChange={(e) => setFilters(prev => ({ ...prev, salesperson: e.target.value }))}
                    />
                  )}

                  <InputField
                    label="Min Amount"
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  />

                  <InputField
                    label="Max Amount"
                    type="number"
                    placeholder="999999"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Table or Cards for small screens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Invoices ({filteredInvoices.length})</span>
              {error && (
                <div className="flex items-center gap-2 text-error-600 dark:text-error-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Responsive table for md and up */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    {userRole !== 'salesperson' && <TableHead>Salesperson</TableHead>}
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      {userRole !== 'salesperson' && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-neutral-400" />
                            {invoice.salesPersonName}
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell>
                        {formatDate(invoice.date)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {invoice.payments.length} payment{invoice.payments.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('View invoice:', invoice.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          
                          {(userRole === 'supervisor' || userRole === 'ceo') && invoice.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveInvoice(invoice.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Card list for small screens */}
            <div className="md:hidden space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{invoice.invoiceNumber}</span>
                      {getStatusBadge(invoice.status)}
                    </div>
                    {userRole !== 'salesperson' && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <User className="w-4 h-4" />
                        {invoice.salesPersonName}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-semibold">Amount: </span>{formatCurrency(invoice.amount)}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Date: </span>{formatDate(invoice.date)}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Payments: </span>{invoice.payments.length} payment{invoice.payments.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log('View invoice:', invoice.id)}
                        className="flex items-center gap-1 flex-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      {(userRole === 'supervisor' || userRole === 'ceo') && invoice.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveInvoice(invoice.id)}
                          className="flex items-center gap-1 flex-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {searchTerm || Object.values(filters).some(f => f !== '' && f !== 'all') 
                      ? 'No invoices match your search criteria'
                      : 'No invoices found'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoicePage;
