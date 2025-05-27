import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockUsers } from '../../utils/mockData/users';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const SalesTeamPage: React.FC = () => {
  const navigate = useNavigate();
  // Filter salespersons from mockUsers
  const salesTeam = mockUsers.filter(user => user.role === 'salesperson');

  const getFlaggedBadge = (isFlagged: boolean) => {
    return isFlagged ? (
      <Badge className="bg-error-100 text-error-800">Flagged</Badge>
    ) : (
      <Badge className="bg-success-100 text-success-800">Active</Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Sales Team
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Overview of all sales team members.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Responsive table for md and up */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Total Debt</TableHead>
                    <TableHead>Daily Savings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesTeam.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phoneNumber}</TableCell>
                      <TableCell>{member.region}</TableCell>
                      <TableCell>{new Date(member.dateJoined).toLocaleDateString()}</TableCell>
                      <TableCell>{member.totalDebt.toLocaleString()}</TableCell>
                      <TableCell>{member.dailySavings.toLocaleString()}</TableCell>
                      <TableCell>{getFlaggedBadge(member.isFlagged)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/team/${member.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Card list for small screens */}
            <div className="md:hidden space-y-4">
              {salesTeam.map(member => (
                <Card key={member.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      {getFlaggedBadge(member.isFlagged)}
                    </div>
                    <p>{member.email}</p>
                    <p>{member.phoneNumber}</p>
                    <p>{member.region}</p>
                    <p>{new Date(member.dateJoined).toLocaleDateString()}</p>
                    <p>Total Debt: {member.totalDebt.toLocaleString()}</p>
                    <p>Daily Savings: {member.dailySavings.toLocaleString()}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/team/${member.id}`)}
                      className="mt-2"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesTeamPage;
