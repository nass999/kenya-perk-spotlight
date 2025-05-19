import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Building2, 
  Zap, 
  TrendingUp,
  Award,
  CheckCircle,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardStats, VendorWithPerks } from '@/types/dashboard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.companies}</div>
            <p className="mt-2 text-xs text-gray-500">
              Organizations on platform
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.users}</div>
            <p className="mt-2 text-xs text-gray-500">
              Total registered teams
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              Total Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Available perks platform-wide
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.redeemedPerks}</div>
            <p className="mt-2 text-xs text-gray-500">
              Total perk redemptions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Vendors Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vendors with Active Perks</h2>
          <Button variant="outline" size="sm">
            <Store className="mr-2 h-4 w-4" />
            View All Vendors
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {activeVendors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead className="text-right">Active Perks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeVendors.map((vendor, index) => (
                    <TableRow key={index}>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Organizations
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Manage Platform Perks
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>User growth: +12% this month</span>
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
        <div className="rounded-lg border bg-white p-6">
          <div className="text-center text-gray-500 py-10">
            <p>No recent activity to display.</p>
            <p className="mt-2">System activity will be shown here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminDashboard;
