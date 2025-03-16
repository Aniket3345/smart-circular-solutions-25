
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { register } from '@/utils/auth';
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: any) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      console.log("Registration attempt with:", data);
      
      // Validate required fields
      if (!data.name || !data.email || !data.password) {
        toast.open({
          title: "Registration failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const user = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        pincode: data.pincode,
        address: data.address
      });
      
      console.log("Registration success:", user);
      
      if (user) {
        toast.open({
          title: "Registration successful",
          description: "Your account has been created. Welcome to Smart Circular!",
        });
        // Redirect to home page after successful registration
        navigate('/');
      } else {
        // Handle the case where register returns false but doesn't throw an error
        toast.open({
          title: "Registration failed",
          description: "Please check your information and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.open({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          
          <AuthForm 
            type="register" 
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
