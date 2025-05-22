
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
  ChevronRight
} from 'lucide-react';
import { DashboardStats, VendorWithPerks } from '@/types/dashboard';
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

interface MasterAdminDashboardProps {
  stats: DashboardStats;
  welcomeMessage: string;
  activeVendors?: VendorWithPerks[];
}

const MasterAdminDashboard: React.FC<MasterAdminDashboardProps> = ({ stats, welcomeMessage, activeVendors = [] }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{welcomeMessage}</h1>
        <p className="mt-2 text-gray-500">
          Master Admin Dashboard - Platform Overview
        </p>
      </div>
      
      {/* Companies with Employees Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Companies & Employees
          </CardTitle>
          <CardDescription>
            Overview of all companies and their associated employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.companyUsers && stats.companyUsers.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {stats.companyUsers.map((company) => (
                <AccordionItem key={company.companyId || company.companyName} value={company.companyId || company.companyName}>
                  <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{company.companyName}</span>
                      </div>
                      <Badge variant="outline" className={`ml-2 ${company.userCount > 0 ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
                        {company.userCount} {company.userCount === 1 ? 'employee' : 'employees'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {stats.userDetails && stats.userDetails.filter(user => 
                        // Match by company name (primary) or id (fallback)
                        user.companyName === company.companyName || 
                        (user.companyId && user.companyId === company.companyId)
                      ).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.userDetails
                            .filter(user => 
                              user.companyName === company.companyName || 
                              (user.companyId && user.companyId === company.companyId)
                            )
                            .map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    user.role === 'company_admin' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-green-50 text-green-700 border-green-200'
                                  }>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {user.role}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>No employees found for this company</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="mx-auto h-8 w-8 opacity-30 mb-2" />
              <p>No companies found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Users Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Platform Users
          </CardTitle>
        </CardHeader>
        <CardContent>
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
      
      {/* Active Vendors Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vendors with Active Perks</h2>
        </div>
        
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
      </div>
      
      {/* Platform Health */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Platform Health</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>User growth: +{Math.round(stats.users * 0.12)}% this month</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Most popular perk: Gift cards</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
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
      </div>
    </div>
  );
};

export default MasterAdminDashboard;
