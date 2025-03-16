
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
  loginType?: 'citizen' | 'admin';
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  type, 
  onSubmit, 
  loginType = 'citizen',
  isLoading = false
}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    pincode: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Set default admin credentials if in admin mode
  useEffect(() => {
    if (loginType === 'admin' && type === 'login') {
      setFormData(prev => ({
        ...prev,
        email: 'admin@example.com',
        password: 'admin123'
      }));
    }
  }, [loginType, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    // Skip validation for admin login
    if (loginType === 'admin' && type === 'login') {
      return true;
    }
    
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (type === 'register' && !formData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("Form submission with data:", formData);
      onSubmit(formData);
    } catch (error) {
      console.error('Auth error:', error);
      toast.open({
        title: 'Authentication error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-up glass-card">
      <CardHeader>
        <CardTitle>
          {type === 'login' 
            ? loginType === 'admin' 
              ? 'Admin Login' 
              : 'Welcome back' 
            : 'Create your account'}
        </CardTitle>
        <CardDescription>
          {type === 'login' 
            ? loginType === 'admin'
              ? 'Click the button below to access the admin dashboard'
              : 'Enter your credentials to access your account' 
            : 'Fill in the details below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={`rounded-lg ${errors.name ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
          )}
          
          {(type !== 'login' || loginType !== 'admin') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={`rounded-lg ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                  className={`rounded-lg ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>
            </>
          )}
          
          {type === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                  disabled={isLoading}
                />
              </div>
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full rounded-lg mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === 'login' ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              type === 'login' 
                ? loginType === 'admin' 
                  ? 'Login as Admin' 
                  : 'Login' 
                : 'Create Account'
            )}
          </Button>
        </form>
      </CardContent>
      {loginType !== 'admin' && (
        <CardFooter className="flex justify-center border-t pt-4">
          {type === 'login' ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/register')}>
                Create one
              </Button>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                Login
              </Button>
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default AuthForm;
