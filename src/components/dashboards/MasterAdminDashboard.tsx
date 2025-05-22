
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  Store,
  CheckCircle,
  TrendingUp,
  Award,
  Activity,
  Shield,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Building
} from 'lucide-react';
import { DashboardStats, VendorWithPerks, CompanyUserCount } from '@/types/dashboard';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MasterAdminDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
  activeVendors?: VendorWithPerks[];
  companyUserCounts?: CompanyUserCount[];
}

const MasterAdminDashboard: React.FC<MasterAdminDashboardProps> = ({ 
  stats, 
  welcomeMessage, 
  activeVendors = [], 
  companyUserCounts = [] 
}) => {
  const [openSections, setOpenSections] = useState({
    customers: true,
    users: true,
    vendors: true,
    activity: true,
    requests: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Master Admin Dashboard - Platform Overview
        </p>
      </div>
      
      {/* Customers and Users Section */}
      <Collapsible 
        open={openSections.customers} 
        onOpenChange={() => toggleSection('customers')}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <UserCircle className="mr-2 h-5 w-5 text-blue-500" />
            Customers and Users
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {openSections.customers ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Company User Distribution</CardTitle>
              <CardDescription>
                User distribution across different companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companyUserCounts && companyUserCounts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Users</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyUserCounts.map((company, index) => (
                      <TableRow key={`${company.company_name}-${index}`}>
                        <TableCell className="font-medium flex items-center">
                          <Building className="h-4 w-4 text-blue-500 mr-2" />
                          {company.company_name || 'No Company'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {company.count} {company.count === 1 ? 'user' : 'users'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-8 w-8 opacity-30 mb-2" />
                  <p>No company user data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Users Card */}
      <Collapsible 
        open={openSections.users} 
        onOpenChange={() => toggleSection('users')}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Platform Users
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {openSections.users ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardContent className="pt-6">
              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.userDetails && stats.userDetails.length > 0 ? (
                    stats.userDetails.map((user, index) => (
                      <TableRow key={user.id || index}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'master_admin' ? 'bg-red-50 text-red-700 border-red-200' :
                            user.role === 'company_admin' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            user.role === 'vendor' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }>
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.companyName}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">No users found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Vendor Requests Section */}
      <Collapsible 
        open={openSections.requests} 
        onOpenChange={() => toggleSection('requests')}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Store className="mr-2 h-5 w-5 text-pink-500" />
            Perk & Vendor Requests
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {openSections.requests ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Employee Vendor Recommendations</CardTitle>
              <CardDescription>
                Vendor recommendations submitted by employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.vendorRequests && stats.vendorRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.vendorRequests.map((request, index) => (
                      <TableRow key={request.id || index}>
                        <TableCell className="font-medium">
                          <div>
                            {request.vendor_name}
                            {request.website && (
                              <div className="text-xs text-gray-500 mt-1">{request.website}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{request.userName || request.user_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            request.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            request.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="ml-2">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Store className="mx-auto h-8 w-8 opacity-30 mb-2" />
                  <p>No vendor recommendations found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Active Vendors Table */}
      <Collapsible 
        open={openSections.vendors} 
        onOpenChange={() => toggleSection('vendors')}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Vendors with Active Perks
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {openSections.vendors ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardContent className="pt-6">
              {activeVendors && activeVendors.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead className="text-right">Active Perks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeVendors.map((vendor, index) => (
                      <TableRow key={vendor.name + index}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell className="text-right">{vendor.perkCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Store className="mx-auto h-8 w-8 opacity-30 mb-2" />
                  <p>No active vendors found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Recent Activity */}
      <Collapsible 
        open={openSections.activity} 
        onOpenChange={() => toggleSection('activity')}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="mr-2 h-5 w-5 text-indigo-500" />
            Recent Activity
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {openSections.activity ? 
                <ChevronDown className="h-4 w-4" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity, index) => (
                    <li key={index} className="py-4 px-6 flex items-start gap-3">
                      <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <div className="text-sm text-gray-700 mt-1">
                          {activity.details}
                        </div>
                        <div className="text-sm text-gray-500 flex gap-2 mt-1">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                          {activity.companyName && (
                            <>
                              <span>•</span>
                              <span>{activity.companyName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-10">
                    <p>No recent activity to display.</p>
                    <p className="mt-2">System activity will be shown here</p>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MasterAdminDashboard;
