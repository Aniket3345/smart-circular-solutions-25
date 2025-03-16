
import { createClient } from '@supabase/supabase-js';
import { useSupabase } from '@/hooks/useSupabase';

export interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
  role: 'user' | 'admin';
  joinDate: string;
  pincode?: string;
  address?: string;
}

export interface Report {
  id: string;
  userId: string;
  type: 'waste' | 'flood' | 'electricity';
  description: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number; // Timestamp in milliseconds
  location?: {
    address: string;
    latitude: number;
    longitude: number;
  };
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
    pincode: '400001',
    address: '123 Main St, Mumbai',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    rewardPoints: 500,
    role: 'admin',
    joinDate: '2023-05-10',
    pincode: '400050',
    address: '456 Central Ave, Mumbai',
  },
];

// Mock reports for development
const mockReports: Report[] = [
  {
    id: 'r1',
    userId: '1',
    type: 'waste',
    description: 'Large pile of garbage near the park',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    status: 'pending',
    timestamp: Date.now() - 86400000, // 1 day ago
    location: {
      address: 'Marine Drive, Mumbai',
      latitude: 18.9442,
      longitude: 72.8237,
    },
  },
  {
    id: 'r2',
    userId: '1',
    type: 'flood',
    description: 'Street flooding after heavy rain',
    imageUrl: 'https://images.unsplash.com/photo-1613559806609-790411b0cea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    status: 'approved',
    timestamp: Date.now() - 172800000, // 2 days ago
    location: {
      address: 'Dadar, Mumbai',
      latitude: 19.0178,
      longitude: 72.8478,
    },
  },
  {
    id: 'r3',
    userId: '2',
    type: 'electricity',
    description: 'Fallen power line after storm',
    imageUrl: 'https://images.unsplash.com/photo-1621954809142-7c5c73da001c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG93ZXIlMjBsaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    status: 'rejected',
    timestamp: Date.now() - 259200000, // 3 days ago
    location: {
      address: 'Bandra, Mumbai',
      latitude: 19.0596,
      longitude: 72.8295,
    },
  },
];

// Helper function to check if Supabase is configured
const isSupabaseConfigured = () => {
  try {
    const { supabase } = useSupabase();
    return !!supabase;
  } catch (error) {
    console.error('Error checking Supabase configuration:', error);
    return false;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    // First try to use Supabase if available
    if (isSupabaseConfigured()) {
      // Fix: We need to check for session in localStorage since getSession() returns a Promise
      return !!localStorage.getItem('sb-session');
    }
    
    // Fallback to localStorage for development
    return !!localStorage.getItem('user');
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Check if user is admin
export const isAdmin = (): boolean => {
  try {
    const user = getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      // Fix: We can't await here since we're not in an async function
      // Instead, check localStorage for the user data that would be set during login
      const userString = localStorage.getItem('sb-user');
      if (userString) {
        return JSON.parse(userString);
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
export const login = async (credentials: { email: string, password: string }): Promise<User | null> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Fix: Properly await the Promise
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create a user object based on Supabase response
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'User',
          rewardPoints: data.user.user_metadata?.rewardPoints || 0,
          role: data.user.email === 'admin@example.com' ? 'admin' : 'user', // Force admin role for admin@example.com
          joinDate: data.user.created_at ? new Date(data.user.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          pincode: data.user.user_metadata?.pincode,
          address: data.user.user_metadata?.address,
        };
        
        // Store user in localStorage for our app to use
        localStorage.setItem('sb-user', JSON.stringify(user));
        localStorage.setItem('sb-session', 'true'); // Set session flag
        return user;
      }
      return null;
    }
    
    // Fallback to mock data for development
    const mockUser = mockUsers.find(user => user.email === credentials.email);
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
export const register = async (userData: { 
  name: string, 
  email: string, 
  password: string,
  pincode?: string,
  address?: string
}): Promise<User | null> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            pincode: userData.pincode,
            address: userData.address,
            rewardPoints: 0 // Initialize reward points to 0
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Create user profile in profiles table
        const newUser: User = {
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          rewardPoints: 0,
          role: 'user',
          joinDate: new Date().toISOString().split('T')[0],
          pincode: userData.pincode,
          address: userData.address,
        };
        
        // Store user in localStorage
        localStorage.setItem('sb-user', JSON.stringify(newUser));
        localStorage.setItem('sb-session', 'true'); // Set session flag
        return newUser;
      }
    }
    
    // Fallback to mock data for development
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      rewardPoints: 0,
      role: 'user',
      joinDate: new Date().toISOString().split('T')[0],
      pincode: userData.pincode,
      address: userData.address,
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
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      supabase.auth.signOut();
    }
    
    // Also remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('sb-user');
    localStorage.removeItem('sb-session');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Update user profile
export const updateUser = async (userData: {
  name?: string,
  pincode?: string,
  address?: string
}): Promise<User | null> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Update user profile in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name || currentUser.name,
          pincode: userData.pincode || currentUser.pincode,
          address: userData.address || currentUser.address,
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update user in localStorage
        const updatedUser = {
          ...currentUser,
          name: userData.name || currentUser.name,
          pincode: userData.pincode || currentUser.pincode,
          address: userData.address || currentUser.address,
        };
        
        localStorage.setItem('sb-user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    
    // Fallback to localStorage for development
    const updatedUser = {
      ...currentUser,
      name: userData.name || currentUser.name,
      pincode: userData.pincode || currentUser.pincode,
      address: userData.address || currentUser.address,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// Add reward points to user
export const addRewardPoints = async (points: number): Promise<User | null> => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;
    
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Update user points in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: {
          rewardPoints: (currentUser.rewardPoints || 0) + points
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update user in localStorage
        const updatedUser = {
          ...currentUser,
          rewardPoints: (currentUser.rewardPoints || 0) + points
        };
        
        localStorage.setItem('sb-user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    
    // Fallback to localStorage for development
    const updatedUser = {
      ...currentUser,
      rewardPoints: currentUser.rewardPoints + points,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Add reward points error:', error);
    throw error;
  }
};

// Get all users (for admin purposes)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Get all users from Supabase
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      if (data?.users) {
        // Map Supabase users to our User interface
        return data.users.map(user => ({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || 'User',
          rewardPoints: user.user_metadata?.rewardPoints || 0,
          role: user.email === 'admin@example.com' ? 'admin' : 'user',
          joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          pincode: user.user_metadata?.pincode,
          address: user.user_metadata?.address,
        }));
      }
    }
    
    // Fallback to mock data for development
    return mockUsers;
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Get user from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          rewardPoints: data.reward_points || 0,
          role: data.role || 'user',
          joinDate: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          pincode: data.pincode,
          address: data.address,
        };
      }
    }
    
    // Fallback to mock data for development
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

// Get user's reports
export const getUserReports = async (userId: string): Promise<Report[]> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Get user reports from Supabase
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data) {
        return data.map((report: any) => ({
          id: report.id,
          userId: report.user_id,
          type: report.type,
          description: report.description,
          imageUrl: report.image_url,
          status: report.status,
          timestamp: new Date(report.created_at).getTime(),
          location: report.location ? {
            address: report.location.address,
            latitude: report.location.latitude,
            longitude: report.location.longitude,
          } : undefined,
        }));
      }
      
      return [];
    }
    
    // Fallback to mock data for development
    return mockReports.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Get user reports error:', error);
    return [];
  }
};

// Get all reports (for admin purposes)
export const getAllReports = async (): Promise<Report[]> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Get all reports from Supabase
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        return data.map((report: any) => ({
          id: report.id,
          userId: report.user_id,
          type: report.type,
          description: report.description,
          imageUrl: report.image_url,
          status: report.status,
          timestamp: new Date(report.created_at).getTime(),
          location: report.location ? {
            address: report.location.address,
            latitude: report.location.latitude,
            longitude: report.location.longitude,
          } : undefined,
        }));
      }
    }
    
    // Fallback to mock data for development
    return mockReports;
  } catch (error) {
    console.error('Get all reports error:', error);
    return [];
  }
};

// Update report status
export const updateReportStatus = async (
  reportId: string, 
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    // Try to use Supabase if available
    if (isSupabaseConfigured()) {
      const { supabase } = useSupabase();
      // Update report status in Supabase
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);
      
      if (error) throw error;
      
      // If report is approved, add points to user
      if (status === 'approved') {
        // Get the report to get the user ID
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('user_id')
          .eq('id', reportId)
          .single();
        
        if (reportError) throw reportError;
        
        if (reportData) {
          const userId = reportData.user_id;
          
          // Get user data
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('reward_points')
            .eq('id', userId)
            .single();
          
          if (userError) throw userError;
          
          if (userData) {
            // Update user points
            const newPoints = (userData.reward_points || 0) + 10;
            await supabase
              .from('profiles')
              .update({ reward_points: newPoints })
              .eq('id', userId);
          }
        }
      }
      
      return true;
    }
    
    // Fallback to mock data for development
    const reportIndex = mockReports.findIndex(r => r.id === reportId);
    if (reportIndex === -1) return false;
    
    mockReports[reportIndex].status = status;
    
    // If report is approved, add points to user
    if (status === 'approved') {
      const userId = mockReports[reportIndex].userId;
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].rewardPoints += 10; // Award 10 points for approved reports
      }
    }
    
    return true;
  } catch (error) {
    console.error('Update report status error:', error);
    return false;
  }
};
