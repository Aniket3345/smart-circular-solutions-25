import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  rewardPoints: number;
  password?: string; // Only used for local registration
  role?: 'user' | 'admin';
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

// Initialize Supabase client
let supabase: SupabaseClient | null = null;
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

// Local storage keys (used for both Supabase and mock auth)
const AUTH_TOKEN_KEY = 'smartCircular_auth_token';
const USER_DATA_KEY = 'smartCircular_user_data';

// Mock database functionality (fallback if Supabase is not available)
const USERS_DB_KEY = 'smartCircular_users_db';
const REPORTS_DB_KEY = 'smartCircular_reports_db';

// Initialize the mock database if it doesn't exist
function initMockDatabase() {
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
}

// User registration
export const register = async (userData: Partial<User>): Promise<boolean> => {
  try {
    if (supabase) {
      // Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email: userData.email as string,
        password: userData.password as string,
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        toast.open({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      if (data.user) {
        // Create user profile in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: userData.name,
              email: userData.email,
              address: userData.address || '',
              pincode: userData.pincode || '',
              reward_points: 0,
              role: 'user' // Default role for new users
            }
          ]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast.open({
            title: 'Profile creation failed',
            description: 'Your account was created but profile setup failed.',
            variant: 'destructive',
          });
        }
        
        // Store user data in localStorage for easy access
        const userProfile = {
          id: data.user.id,
          name: userData.name || '',
          email: userData.email || '',
          address: userData.address || '',
          pincode: userData.pincode || '',
          rewardPoints: 0,
          role: 'user'
        };
        
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));
        
        toast.open({
          title: 'Account created!',
          description: 'You have successfully registered.',
        });
        
        return true;
      }
    } else {
      // Mock database implementation
      // ... keep existing code (for mock registration)
    }
    
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
      // For admin login with hardcoded credentials
      if (credentials.email === 'admin' && credentials.password === 'admin') {
        // Store mock admin user data
        const adminUser = {
          id: 'admin-1',
          name: 'Administrator',
          email: 'admin',
          rewardPoints: 0,
          role: 'admin'
        };
        
        localStorage.setItem(AUTH_TOKEN_KEY, `mock-admin-token`);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(adminUser));
        
        toast.open({
          title: 'Admin login successful',
          description: 'Welcome to the admin dashboard',
        });
        
        return true;
      }
      
      // Regular Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        toast.open({
          variant: 'destructive',
          title: 'Login failed',
          description: error.message,
        });
        return false;
      }
      
      if (data.user) {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
        
        // Store user data in localStorage for easy access
        const userProfile = profileData 
          ? {
              id: data.user.id,
              name: profileData.name,
              email: data.user.email,
              address: profileData.address || '',
              pincode: profileData.pincode || '',
              rewardPoints: profileData.reward_points || 0,
              role: profileData.role || 'user'
            }
          : {
              id: data.user.id,
              name: 'User',
              email: data.user.email,
              rewardPoints: 0,
              role: 'user'
            };
        
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));
        
        toast.open({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        
        return true;
      }
    } else {
      // Mock database implementation
      // ... keep existing code (for mock login)
    }
    
    return false;
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

export const logout = async (): Promise<void> => {
  try {
    if (supabase) {
      await supabase.auth.signOut();
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
  return localStorage.getItem(USER_DATA_KEY) !== null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const isAdmin = (): boolean => {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'admin';
};

export const updateUser = async (userData: Partial<User>): Promise<boolean> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    if (supabase) {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          address: userData.address,
          pincode: userData.pincode
        })
        .eq('id', currentUser.id);
      
      if (error) {
        console.error('Error updating user profile:', error);
        toast.open({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
    } else {
      // Update in mock database
      // ... keep existing code (for mock update)
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

// Add reward points to a user
export const addRewardPoints = async (points: number, userId?: string): Promise<User | null> => {
  try {
    // If userId is provided, update that specific user (admin function)
    // Otherwise, update the current user
    const userToUpdate = userId ? await getUserById(userId) : getCurrentUser();
    if (!userToUpdate) return null;
    
    if (supabase) {
      // Update points in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          reward_points: (userToUpdate.rewardPoints || 0) + points
        })
        .eq('id', userToUpdate.id);
      
      if (error) {
        console.error('Error updating reward points:', error);
        return null;
      }
    } else {
      // Mock database implementation
      // ... keep existing code (for mock reward points)
    }
    
    // Update current user data if it's the current user being updated
    if (!userId || userId === getCurrentUser()?.id) {
      const updatedUser = { 
        ...userToUpdate, 
        rewardPoints: (userToUpdate.rewardPoints || 0) + points 
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    // Return the updated user
    return await getUserById(userId);
  } catch (error) {
    console.error('Add reward points error:', error);
    return null;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          address: data.address || '',
          pincode: data.pincode || '',
          rewardPoints: data.reward_points || 0,
          role: data.role || 'user'
        };
      }
    } else {
      // Mock database implementation
      // ... keep existing code (for mock getUserById)
    }
    
    return null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

// Get all users - useful for admin views
export const getAllUsers = async (): Promise<User[]> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address || '',
        pincode: user.pincode || '',
        rewardPoints: user.reward_points || 0,
        role: user.role || 'user'
      }));
    } else {
      // Mock database implementation
      // ... keep existing code (for mock getAllUsers)
    }
    
    return [];
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
};

// Add a report function
export const addReport = async (reportData: Partial<Report>): Promise<Report | null> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    const newReport: Partial<Report> = {
      userId: currentUser.id,
      type: reportData.type || 'waste',
      imageUrl: reportData.imageUrl,
      description: reportData.description,
      location: reportData.location,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    if (supabase) {
      // Add report to Supabase
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          user_id: newReport.userId,
          type: newReport.type,
          image_url: newReport.imageUrl,
          description: newReport.description,
          location: newReport.location,
          timestamp: newReport.timestamp,
          status: newReport.status
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding report:', error);
        return null;
      }
      
      if (data) {
        return {
          id: data.id,
          userId: data.user_id,
          type: data.type,
          imageUrl: data.image_url,
          description: data.description,
          location: data.location,
          timestamp: data.timestamp,
          status: data.status
        };
      }
    } else {
      // Mock database implementation
      // ... keep existing code (for mock addReport)
    }
    
    return null;
  } catch (error) {
    console.error('Add report error:', error);
    return null;
  }
};

// Get all reports
export const getAllReports = async (): Promise<Report[]> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching reports:', error);
        return [];
      }
      
      return data.map(report => ({
        id: report.id,
        userId: report.user_id,
        type: report.type,
        imageUrl: report.image_url,
        description: report.description,
        location: report.location,
        timestamp: report.timestamp,
        status: report.status
      }));
    } else {
      // Mock database implementation
      // ... keep existing code (for mock getAllReports)
    }
    
    return [];
  } catch (error) {
    console.error('Get all reports error:', error);
    return [];
  }
};

// Get reports by user
export const getReportsByUser = async (userId: string): Promise<Report[]> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching user reports:', error);
        return [];
      }
      
      return data.map(report => ({
        id: report.id,
        userId: report.user_id,
        type: report.type,
        imageUrl: report.image_url,
        description: report.description,
        location: report.location,
        timestamp: report.timestamp,
        status: report.status
      }));
    } else {
      // Mock database implementation
      // ... keep existing code (for mock getReportsByUser)
    }
    
    return [];
  } catch (error) {
    console.error('Get reports by user error:', error);
    return [];
  }
};

// Update report status
export const updateReportStatus = async (reportId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
  try {
    if (supabase) {
      // Update status in Supabase
      const { error, data } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating report status:', error);
        return false;
      }
      
      // If approved, award points to user
      if (status === 'approved' && data) {
        await addRewardPoints(10, data.user_id);
      }
      
      return true;
    } else {
      // Mock database implementation
      // ... keep existing code (for mock updateReportStatus)
    }
    
    return false;
  } catch (error) {
    console.error('Update report status error:', error);
    return false;
  }
};
