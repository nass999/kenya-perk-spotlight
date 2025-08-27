
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth';
import BackToHomeButton from '@/components/BackToHomeButton';
import LoginForm from '@/components/auth/LoginForm';
import SuccessState from '@/components/auth/SuccessState';
import { useRandomPerks } from '@/hooks/useRandomPerks';
import { Clock, Gift } from 'lucide-react';

const Login = () => {
  const { authState, signOut } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  
  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authState.user && !authState.loading) {
      console.log("User already authenticated, redirecting to dashboard", authState.user);
      navigate(redirectTo || '/dashboard', { replace: true });
    }
  }, [authState.user, authState.loading, navigate, redirectTo]);
  
  const handleLoginSuccess = () => {
    setIsSuccess(true);
    
    // Force navigation to dashboard after a short delay
    console.log("Setting immediate redirect to dashboard");
    setTimeout(() => {
      console.log("Executing manual navigation to dashboard");
      navigate(redirectTo || '/dashboard', { replace: true });
    }, 1000);
  };
  
  // Success UI shown briefly before redirection
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <SuccessState />
        <BackToHomeButton />
      </div>
    );
  }
  
  const { perks, loading: perksLoading } = useRandomPerks();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* Trial Banner */}
        <Card className="w-full max-w-md bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">7 Days Free Trial</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Full access to all perks and rewards
            </p>
          </CardContent>
        </Card>

        {/* Login Card */}
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Log In</CardTitle>
            <CardDescription>
              Access your Africa Rewards Network account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>

        {/* Featured Perks Preview */}
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <Gift className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Featured Perks Available</CardTitle>
            </div>
            <CardDescription>
              Get instant access to these amazing offers and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            {perksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {perks.slice(0, 4).map((perk) => (
                  <div key={perk.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm line-clamp-1">{perk.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {perk.discount_type === 'percentage' 
                          ? `${perk.discount_amount}% OFF` 
                          : `$${perk.discount_amount} OFF`
                        }
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {perk.description}
                    </p>
                    {perk.category && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {perk.category}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!perksLoading && perks.length === 0 && (
              <p className="text-center text-muted-foreground">
                No perks available at the moment
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <BackToHomeButton />
    </div>
  );
};

export default Login;
