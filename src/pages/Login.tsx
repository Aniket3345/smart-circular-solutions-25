
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { login } from '@/utils/auth';

const Login = () => {
  const handleLogin = async (data: any) => {
    await login({
      email: data.email,
      password: data.password
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={false} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <Button variant="ghost" size="sm" className="gap-1 h-8 rounded-full px-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <AuthForm type="login" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
