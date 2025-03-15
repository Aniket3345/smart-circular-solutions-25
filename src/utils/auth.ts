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
  role?: 'user' | 'admin'; // Add role field for admin differentiation
}

// Report type definition
export interface Report {
  id: string;
  userId: string;
  type: 'waste' | 'flood' | 'electricity';
  imageUrl?: string;
  description?: string;
  location?: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Create a mock database for development
const USERS_DB_KEY = 'smartCircular_users_db';
const REPORTS_DB_KEY = 'smartCircular_reports_db';

// Initialize the mock database if it doesn't exist
const initMockDatabase = () => {
  if (!localStorage.getItem(USERS_DB_KEY)) {
    // Add a default admin account
    const adminUser: User = {
      id: 'admin-1',
      name: 'Administrator',
      email: 'admin',
      rewardPoints: 0,
      password: 'admin',
      role: 'admin'
    };
    
    localStorage.setItem(USERS_DB_KEY, JSON.stringify([adminUser]));
  }
  
  if (!localStorage.getItem(REPORTS_DB_KEY)) {
    localStorage.setItem(REPORTS_DB_KEY, JSON.stringify([]));
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
        toast.open({
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
        password: userData.password,
        role: 'user' // Default role for new users
      };
      
      // Add to mock database
      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      
      // Log in the user
      localStorage.setItem(AUTH_TOKEN_KEY, `mock-token-${newUser.id}`);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    }
    
    toast.open({
      title: 'Account created!',
      description: 'You have successfully registered.',
    });
    
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    toast.open({
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
        toast.open({
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
    
    toast.open({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.open({
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
    
    toast.open({
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

export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
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
    
    toast.open({
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
export const addRewardPoints = async (points: number, userId?: string): Promise<User | null> => {
  try {
    // If userId is provided, update that specific user (admin function)
    // Otherwise, update the current user
    const userToUpdate = userId ? getUserById(userId) : getCurrentUser();
    if (!userToUpdate) return null;
    
    if (supabase) {
      // Implement real Supabase update here when credentials are available
      console.log('Would update reward points with Supabase:', points);
    } else {
      // Update in mock database
      const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userToUpdate.id);
      
      if (userIndex >= 0) {
        users[userIndex].rewardPoints += points;
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }
    }
    
    // Update current user data if it's the current user being updated
    if (!userId) {
      const updatedUser = { 
        ...userToUpdate, 
        rewardPoints: userToUpdate.rewardPoints + points 
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    // Return the updated user
    return getUserById(userId);
  } catch (error) {
    console.error('Add reward points error:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const user = users.find((u: User) => u.id === userId);
    return user || null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

// Get all users - useful for admin views
export const getAllUsers = (): User[] => {
  if (supabase) {
    // For a real Supabase implementation, you would fetch users from the database
    console.log('Would fetch all users from Supabase');
    return [];
  } else {
    // Return users from mock database
    const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    return users;
  }
};

// Add a report function
export const addReport = (reportData: Partial<Report>): Report | null => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const newReport: Report = {
      id: `report-${Date.now()}`,
      userId: currentUser.id,
      type: reportData.type || 'waste',
      imageUrl: reportData.imageUrl,
      description: reportData.description,
      location: reportData.location,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    // Add to mock database
    const reports = JSON.parse(localStorage.getItem(REPORTS_DB_KEY) || '[]');
    reports.push(newReport);
    localStorage.setItem(REPORTS_DB_KEY, JSON.stringify(reports));
    
    return newReport;
  } catch (error) {
    console.error('Add report error:', error);
    return null;
  }
};

// Get all reports
export const getAllReports = (): Report[] => {
  try {
    const reports = JSON.parse(localStorage.getItem(REPORTS_DB_KEY) || '[]');
    return reports;
  } catch (error) {
    console.error('Get all reports error:', error);
    return [];
  }
};

// Get reports by user
export const getReportsByUser = (userId: string): Report[] => {
  try {
    const reports = JSON.parse(localStorage.getItem(REPORTS_DB_KEY) || '[]');
    return reports.filter((report: Report) => report.userId === userId);
  } catch (error) {
    console.error('Get reports by user error:', error);
    return [];
  }
};

// Update report status
export const updateReportStatus = (reportId: string, status: 'approved' | 'rejected'): boolean => {
  try {
    const reports = JSON.parse(localStorage.getItem(REPORTS_DB_KEY) || '[]');
    const reportIndex = reports.findIndex((r: Report) => r.id === reportId);
    
    if (reportIndex >= 0) {
      reports[reportIndex].status = status;
      localStorage.setItem(REPORTS_DB_KEY, JSON.stringify(reports));
      
      // If approved, award points to user
      if (status === 'approved') {
        const report = reports[reportIndex];
        addRewardPoints(10, report.userId);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Update report status error:', error);
    return false;
  }
};
