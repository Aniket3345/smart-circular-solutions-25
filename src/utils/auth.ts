
import { createClient } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
  role: 'user' | 'admin';
  joinDate: string;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    rewardPoints: 150,
    role: 'user',
    joinDate: '2023-06-15',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    rewardPoints: 500,
    role: 'admin',
    joinDate: '2023-05-10',
  },
];

// Initialize supabase client
let supabase: any = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase environment variables not found, falling back to mock data');
  }
} catch (error) {
  console.error('Error initializing Supabase:', error);
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    // First try to use Supabase if available
    if (supabase) {
      const session = supabase.auth.getSession();
      return !!session;
    }
    
    // Fallback to localStorage for development
    return !!localStorage.getItem('user');
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    // Try to use Supabase if available
    if (supabase) {
      const { data } = supabase.auth.getUser();
      if (data?.user) {
        // Get user profile from profiles table
        // This would need to be implemented with proper Supabase queries
        return data.user;
      }
      return null;
    }
    
    // Fallback to localStorage for development
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Login user
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Try to use Supabase if available
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (data?.user) {
        // Get user profile from profiles table
        // This would need to be implemented with proper Supabase queries
        return data.user;
      }
    }
    
    // Fallback to mock data for development
    const mockUser = mockUsers.find(user => user.email === email);
    if (mockUser) {
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register user
export const register = async (name: string, email: string, password: string): Promise<User | null> => {
  try {
    // Try to use Supabase if available
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create user profile in profiles table
        // This would need to be implemented with proper Supabase queries
        return data.user;
      }
    }
    
    // Fallback to mock data for development
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      rewardPoints: 0,
      role: 'user',
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  try {
    // Try to use Supabase if available
    if (supabase) {
      supabase.auth.signOut();
    }
    
    // Also remove from localStorage
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
