
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  rewardPoints: number;
}

// Create a mock user for development
const MOCK_USER: User = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  address: '123 Green Street, Mumbai',
  pincode: '400001',
  rewardPoints: 750
};

// Initialize Supabase client if credentials are available
let supabase: any = null;
try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Missing Supabase credentials. Using mock auth service.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Local storage keys
const AUTH_TOKEN_KEY = 'smartCircular_auth_token';
const USER_DATA_KEY = 'smartCircular_user_data';

// Mock auth functions for development when Supabase isn't configured
export const register = async (userData: Partial<User>): Promise<boolean> => {
  try {
    if (supabase) {
      // Implement real Supabase registration here when credentials are available
      console.log('Would register with Supabase:', userData);
    }
    
    // For development: Create a mock user and store in localStorage
    const mockUserData = {
      ...MOCK_USER,
      name: userData.name || MOCK_USER.name,
      email: userData.email || MOCK_USER.email,
      address: userData.address || MOCK_USER.address,
      pincode: userData.pincode || MOCK_USER.pincode
    };
    
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock-token-12345');
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUserData));
    
    toast({
      title: 'Account created!',
      description: 'You have successfully registered.',
    });
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    toast({
      variant: 'destructive',
      title: 'Registration failed',
      description: 'Please try again later.',
    });
    return false;
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    if (supabase) {
      // Implement real Supabase login here when credentials are available
      console.log('Would login with Supabase:', email);
    }
    
    // For development: Store mock user in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, 'mock-token-12345');
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(MOCK_USER));
    
    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description: 'Invalid email or password. Please try again.',
    });
    return false;
  }
};

export const logout = (): void => {
  try {
    if (supabase) {
      // Implement real Supabase logout here when credentials are available
      console.log('Would logout with Supabase');
    }
    
    // Remove auth data from localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_TOKEN_KEY) !== null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const updateUser = (userData: Partial<User>): boolean => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
    
    return true;
  } catch (error) {
    console.error('Update user error:', error);
    return false;
  }
};
