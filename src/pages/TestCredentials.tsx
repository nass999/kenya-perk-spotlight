import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, User, Mail, Lock, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import BackToHomeButton from '@/components/BackToHomeButton';

const TestCredentials = () => {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const testAccounts = [
    {
      role: 'Master Admin',
      email: 'master@arnetwork.com',
      password: 'master123',
      description: 'Full system access - can manage all vendors, companies, and users',
      color: 'bg-red-100 text-red-800'
    },
    {
      role: 'Company Admin',
      email: 'admin@arnetwork.com',
      password: 'admin123',
      description: 'Company management - can manage perks and users for their company',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      role: 'Employee',
      email: 'employee@arnetwork.com',
      password: 'employee123',
      description: 'Employee access - can browse and redeem perks, submit vendor recommendations',
      color: 'bg-green-100 text-green-800'
    },
    {
      role: 'Vendor',
      email: 'vendor@arnetwork.com',
      password: 'vendor123',
      description: 'Vendor access - can manage their own perks and view analytics',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Credentials</h1>
          <p className="text-gray-600">Use these accounts to test different user roles and functionality</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Testing Instructions</h3>
              <p className="text-blue-800 text-sm">
                These are pre-configured test accounts. Use them to explore different features based on user roles. 
                You can log in with any of these credentials on the login page.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testAccounts.map((account, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {account.role}
                  </CardTitle>
                  <Badge className={account.color}>
                    {account.role}
                  </Badge>
                </div>
                <CardDescription>{account.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{account.email}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.email, 'Email')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{account.password}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.password, 'Password')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Development Notes</h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• These accounts are for testing purposes only</li>
            <li>• Each role has different permissions and dashboard views</li>
            <li>• Test data has been populated including perks, vendors, and redemptions</li>
            <li>• You can create new accounts through the registration flow</li>
          </ul>
        </div>
      </div>
      <BackToHomeButton />
    </div>
  );
};

export default TestCredentials;