
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { login, isAdmin } from '@/utils/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Login = () => {
  const [loginType, setLoginType] = useState<'citizen' | 'admin'>('citizen');
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    const success = await login({
      email: data.email,
      password: data.password
    });
    
    if (success) {
      if (loginType === 'admin' && !isAdmin()) {
        // If trying to login as admin but user is not an admin
        navigate('/');
      } else if (loginType === 'admin' && isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
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
          
          <Tabs defaultValue="citizen" className="mb-6" onValueChange={(value) => setLoginType(value as 'citizen' | 'admin')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="citizen">Citizen Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <AuthForm 
            type="login" 
            onSubmit={handleLogin} 
            loginType={loginType} 
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
