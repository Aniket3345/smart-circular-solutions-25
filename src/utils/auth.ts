
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  rewardPoints: number;
  password?: string; // Add password field to support the Register form
}

// Create a mock database for development
const USERS_DB_KEY = 'smartCircular_users_db';

// Initialize the mock database if it doesn't exist
const initMockDatabase = () => {
  if (!localStorage.getItem(USERS_DB_KEY)) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify([]));
  }
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
    initMockDatabase();
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  initMockDatabase();
}

// Local storage keys
const AUTH_TOKEN_KEY = 'smartCircular_auth_token';
const USER_DATA_KEY = 'smartCircular_user_data';

// User registration
export const register = async (userData: Partial<User>): Promise<boolean> => {
  try {
    if (supabase) {
      // Implement real Supabase registration here when credentials are available
      console.log('Would register with Supabase:', userData);
    } else {
      // Mock database implementation
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      
      // Check if email already exists
      if (users.some((user: User) => user.email === userData.email)) {
        toast({
          title: 'Registration failed',
          description: 'This email is already registered.',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'Anonymous User',
        email: userData.email || '',
        address: userData.address || '',
        pincode: userData.pincode || '',
        rewardPoints: 0,
        password: userData.password
      };
      
      // Add to mock database
      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      
      // Log in the user
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${newUser.id}`);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    }
    
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

// User login
export const login = async (credentials: { email: string, password: string }): Promise<boolean> => {
  try {
    if (supabase) {
      // Implement real Supabase login here when credentials are available
      console.log('Would login with Supabase:', credentials.email);
    } else {
      // Mock database implementation
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      
      // Find user by email and password
      const user = users.find((u: User) => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: 'Invalid email or password. Please try again.',
        });
        return false;
      }
      
      // Store user data and token
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${user.id}`);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    }
    
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
    
    if (supabase) {
      // Implement real Supabase update here when credentials are available
      console.log('Would update with Supabase:', userData);
    } else {
      // Update in mock database
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
      
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    }
    
    // Update current user data
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

// Add the addRewardPoints function
export const addRewardPoints = async (points: number): Promise<User | null> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    if (supabase) {
      // Implement real Supabase update here when credentials are available
      console.log('Would update reward points with Supabase:', points);
    } else {
      // Update in mock database
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
      
      if (userIndex >= 0) {
        users[userIndex].rewardPoints += points;
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    }
    
    // Update current user data
    const updatedUser = { 
      ...currentUser, 
      rewardPoints: currentUser.rewardPoints + points 
    };
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Add reward points error:', error);
    return null;
  }
};
