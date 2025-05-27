import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { bankingService } from '../../services/bankingService';
import { BankDeposit, DebtPayment } from '../../types/banking';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const BankingPage: React.FC = () => {
  const [deposits, setDeposits] = useState<BankDeposit[]>([]);
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankingData = async () => {
      try {
        setLoading(true);
        const depositsData = await bankingService.getDeposits();
        setDeposits(depositsData);
        // For demo, fetch debt payments for all or a sample salesperson
        const debtPaymentsData = await bankingService.getDebtPayments('sp1');
        // Ensure debtPaymentsData is an array
        setDebtPayments(Array.isArray(debtPaymentsData) ? debtPaymentsData : []);
      } catch {
        setError('Failed to load banking data');
      } finally {
        setLoading(false);
      }
    };

    fetchBankingData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading banking data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-red-600">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Banking</h1>

        <Card>
          <CardHeader>
            <CardTitle>Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <p>No deposits found.</p>
            ) : (
              <ul>
                {deposits.map(deposit => (
                  <li key={deposit.id}>
                    {deposit.amount} deposited on {new Date(deposit.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debt Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {debtPayments.length === 0 ? (
              <p>No debt payments found.</p>
            ) : (
              <ul>
                {debtPayments.map(payment => (
                  <li key={payment.id}>
                    {payment.amount} paid on {new Date(payment.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BankingPage;
