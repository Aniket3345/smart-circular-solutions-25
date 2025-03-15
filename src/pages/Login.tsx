
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { login, isAdmin } from '@/utils/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [loginType, setLoginType] = useState<'citizen' | 'admin'>('citizen');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (data: any) => {
    const success = await login({
      email: data.email,
      password: data.password
    });
    
    if (success) {
      // After successful login, check if admin and redirect accordingly
      if (loginType === 'admin') {
        if (isAdmin()) {
          toast({
            title: "Admin login successful",
            description: "Redirecting to admin dashboard",
          });
          navigate('/admin');
        } else {
          toast({
            title: "Access denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
          navigate('/');
        }
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
            <TabsContent value="citizen">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Login to your citizen account</p>
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Admin credentials: username "admin", password "admin"</p>
              </div>
            </TabsContent>
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
