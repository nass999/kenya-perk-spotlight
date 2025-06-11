
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Loader2, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Company {
  id: string;
  name: string;
  employee_count?: number;
  website?: string;
  industry?: string;
}

interface User {
  id: string;
  full_name?: string;
  email: string;
  role: string;
  company_id?: string;
  company_name?: string;
  is_active: boolean;
}

interface CompanyWithUsers extends Company {
  users: User[];
  userCount: number;
}

const CompanyUserList: React.FC = () => {
  const [companiesWithUsers, setCompaniesWithUsers] = useState<CompanyWithUsers[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompaniesAndUsers();
  }, []);

  const fetchCompaniesAndUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all companies
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (companiesError) throw companiesError;

      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('company_name, full_name');

      if (usersError) throw usersError;

      console.log('Fetched companies:', companies);
      console.log('Fetched users:', users);

      // Group users by company
      const companiesMap = new Map<string, CompanyWithUsers>();
      const unassigned: User[] = [];

      // Initialize companies map
      companies?.forEach(company => {
        companiesMap.set(company.id, {
          ...company,
          users: [],
          userCount: 0
        });
      });

      // Assign users to companies
      users?.forEach(user => {
        if (user.company_id && companiesMap.has(user.company_id)) {
          companiesMap.get(user.company_id)!.users.push(user);
          companiesMap.get(user.company_id)!.userCount++;
        } else if (!user.company_id) {
          unassigned.push(user);
        } else {
          // User has company_id but company doesn't exist in companies table
          // Create a placeholder company entry
          const placeholderCompany: CompanyWithUsers = {
            id: user.company_id,
            name: user.company_name || 'Unknown Company',
            users: [user],
            userCount: 1
          };
          companiesMap.set(user.company_id, placeholderCompany);
        }
      });

      setCompaniesWithUsers(Array.from(companiesMap.values()));
      setUnassignedUsers(unassigned);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'master_admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'company_admin':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'vendor':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading companies and users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Companies and Users Database Summary</h2>
        <p className="text-gray-600">
          Current companies: {companiesWithUsers.length} | 
          Total users: {companiesWithUsers.reduce((sum, company) => sum + company.userCount, 0) + unassignedUsers.length}
        </p>
      </div>

      {/* Companies with Users */}
      {companiesWithUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Companies and Their Users
            </CardTitle>
            <CardDescription>
              Showing all companies with their assigned users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {companiesWithUsers.map((company) => (
                <AccordionItem key={company.id} value={company.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="font-medium">{company.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {company.userCount} users
                        </Badge>
                        {company.industry && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            {company.industry}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {company.website && (
                        <p className="text-sm text-gray-600">Website: {company.website}</p>
                      )}
                      
                      {company.users.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {company.users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                  {user.full_name || 'Not specified'}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {user.role.replace('_', ' ')}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={user.is_active ? "default" : "destructive"}>
                                    {user.is_active ? "Active" : "Disabled"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-gray-500 italic">No users assigned to this company</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Unassigned Users */}
      {unassignedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Users Without Company Assignment
            </CardTitle>
            <CardDescription>
              Users who are not assigned to any company ({unassignedUsers.length} users)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassignedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || 'Not specified'}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {companiesWithUsers.length === 0 && unassignedUsers.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
            <p className="text-gray-500">No companies or users found in the database.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyUserList;
