
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error handling auth callback:', error);
        navigate('/login');
        return;
      }
      
      navigate('/dashboard');
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Authenticating...</h1>
        <p className="text-gray-500">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
