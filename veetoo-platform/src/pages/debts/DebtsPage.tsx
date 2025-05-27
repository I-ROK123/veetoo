import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { mockUsers } from "../../utils/mockData/users";
import { bankingService } from "../../services/bankingService";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../components/ui/Card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../components/ui/Table";

interface DebtSummary {
  totalDebt: number;
  overdueDebt: number;
  debtRatio: number;
  commission?: number;
}

interface DebtFetchResult {
  summary: DebtSummary | null;
  error: string | null;
}

interface Salesperson {
  id?: string;
  name: string;
  dailySavings: number;
  role: string;
}

// Type guard to check if user is Salesperson (has dailySavings)
function isSalesperson(user: unknown): user is Salesperson {
  if (typeof user !== 'object' || user === null) return false;
  return (
    'role' in user &&
    (user as { role?: string }).role === 'salesperson' &&
    'dailySavings' in user &&
    typeof (user as { dailySavings?: number }).dailySavings === 'number'
  );
}

const DebtsPage: React.FC = () => {
  const salespersons = useMemo(() => mockUsers.filter(isSalesperson) as Salesperson[], []);


  const [debtSummaries, setDebtSummaries] = useState<Record<string, DebtFetchResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtSummaries = async () => {
      setLoading(true);
      setError(null);
      const summaries: Record<string, DebtFetchResult> = {};

      await Promise.all(
        salespersons.map(async (sp: Salesperson) => {
          if (!sp.id) {
            summaries[sp.id ?? 'unknown'] = { summary: null, error: 'Invalid salesperson ID' };
            return;
          }
          try {
            const data = await bankingService.getDebtSummary(sp.id);

            if (
              typeof data?.totalDebt === 'number' &&
              typeof data?.overdueDebt === 'number' &&
              typeof data?.debtRatio === 'number'
            ) {
              summaries[sp.id] = { summary: data, error: null };
            } else {
              summaries[sp.id] = { summary: null, error: 'Invalid data format' };
            }
          } catch (err) {
            summaries[sp.id] = {
              summary: null,
              error: err instanceof Error ? err.message : 'Failed to fetch data',
            };
          }
        })
      );

      setDebtSummaries(summaries);
      if (Object.values(summaries).some(r => r.error)) {
        setError('Some debt summaries failed to load. Please check individual rows.');
      }
      setLoading(false);
    };

    fetchDebtSummaries();
  }, [salespersons]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading debt data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Debt Health</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Salespersons Debt Health & Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Debt</TableHead>
                  <TableHead>Overdue Debt</TableHead>
                  <TableHead>Debt Ratio</TableHead>
                  <TableHead>Daily Savings</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salespersons.map((sp: Salesperson) => {
                  const key = sp.id ?? 'unknown-' + sp.name;
                  const result = debtSummaries[key];
                  const summary = result?.summary;
                  const rowError = result?.error;

                  return (
                    <TableRow key={key}>
                      <TableCell>{sp.name}</TableCell>
                      <TableCell>{summary ? summary.totalDebt.toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>{summary ? summary.overdueDebt.toLocaleString() : 'N/A'}</TableCell>
                      <TableCell>
                        {summary ? `${(summary.debtRatio * 100).toFixed(2)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>{sp.dailySavings?.toLocaleString() ?? 'N/A'}</TableCell>
                      <TableCell>
                        {summary?.commission !== undefined ? summary.commission.toLocaleString() : 'N/A'}
                      </TableCell>
                      <TableCell className={rowError ? 'text-red-600' : 'text-green-600'}>
                        {rowError || 'Loaded'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DebtsPage;
