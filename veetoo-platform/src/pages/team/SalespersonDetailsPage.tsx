import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockUsers } from '../../utils/mockData/users';
import { mockInvoices } from '../../utils/mockData/invoices';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalespersonDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const salesperson = mockUsers.find(user => user.id === id && user.role === 'salesperson');

  if (!salesperson) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Salesperson not found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const sp = salesperson as {
    name: string;
    email: string;
    phoneNumber: string;
    region: string;
    dateJoined: string;
    supervisorName: string;
    totalDebt: number;
    dailySavings: number;
    isFlagged: boolean;
  };

  // Filter invoices for this salesperson
  const invoices = mockInvoices.filter(inv => inv.salesPersonId === id);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        <Button onClick={() => navigate(-1)} variant="outline">Back to Sales Team</Button>

        <Card>
          <CardHeader>
            <CardTitle>Salesperson Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{sp.name}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{sp.email}</p>
              </div>
              <div>
                <p><strong>Phone:</strong> {sp.phoneNumber}</p>
                <p><strong>Region:</strong> {sp.region}</p>
                <p><strong>Date Joined:</strong> {new Date(sp.dateJoined).toLocaleDateString()}</p>
                <p><strong>Supervisor:</strong> {sp.supervisorName}</p>
                <p><strong>Total Debt:</strong> {sp.totalDebt.toLocaleString()}</p>
                <p><strong>Daily Savings:</strong> {sp.dailySavings.toLocaleString()}</p>
                <p><strong>Status:</strong> {sp.isFlagged ? <Badge className="bg-error-100 text-error-800">Flagged</Badge> : <Badge className="bg-success-100 text-success-800">Active</Badge>}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p>No invoices found for this salesperson.</p>
            ) : (
              <>
                {/* Table for md and up */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{invoice.status}</TableCell>
                          <TableCell>{invoice.payments.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Card list for small screens */}
                <div className="md:hidden space-y-4">
                  {invoices.map(invoice => (
                    <Card key={invoice.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{invoice.invoiceNumber}</h3>
                          <Badge className="capitalize">{invoice.status}</Badge>
                        </div>
                        <p>Amount: {formatCurrency(invoice.amount)}</p>
                        <p>Date: {formatDate(invoice.date)}</p>
                        <p>Payments: {invoice.payments.length}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalespersonDetailsPage;
