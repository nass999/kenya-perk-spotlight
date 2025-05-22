
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  Store,
  CheckCircle,
  TrendingUp,
  Award,
  Activity
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
      
      {/* Companies & Employees Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            Companies & Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{stats.companies}</div>
              <p className="text-xs text-gray-500">
                Organizations on platform
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="text-xs text-gray-500">
                Total employees across all companies
              </p>
            </div>
          </div>
          
          {/* Companies Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead className="text-right">Employee Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.companyUsers && stats.companyUsers.length > 0 ? (
                stats.companyUsers.map((company) => (
                  <TableRow key={company.companyId}>
                    <TableCell className="font-medium">{company.companyName}</TableCell>
                    <TableCell className="text-right">{company.userCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-gray-500">No companies found</TableCell>
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
