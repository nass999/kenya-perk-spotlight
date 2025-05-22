
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users } from 'lucide-react';
import { CompanyUserCount } from '@/types/dashboard';

interface TotalUsersViewProps {
  companyUserCounts?: CompanyUserCount[];
}

const TotalUsersView: React.FC<TotalUsersViewProps> = ({ companyUserCounts = [] }) => {
  // Calculate the total number of users across all companies
  const totalUsers = companyUserCounts.reduce((sum, company) => sum + company.count, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Total Users by Company
        </CardTitle>
        <CardDescription>
          Distribution of {totalUsers} users across companies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {companyUserCounts && companyUserCounts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">User Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyUserCounts.map((company, index) => (
                <TableRow key={company.company_name + index}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    {company.company_name}
                  </TableCell>
                  <TableCell className="text-right">{company.count}</TableCell>
                  <TableCell className="text-right">
                    {totalUsers ? ((company.count / totalUsers) * 100).toFixed(1) : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="mx-auto h-8 w-8 opacity-30 mb-2" />
            <p>No company data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalUsersView;
