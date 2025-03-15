
// Authentication service using Supabase
import { createClient } from '@supabase/supabase-js';

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  pincode: string;
  address: string;
  rewardPoints: number;
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  pincode: string;
  address: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if a user is currently logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('sb-auth-token') !== null;
};

// Get the current logged in user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('sb-user');
  return userJson ? JSON.parse(userJson) : null;
};

// Login a user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.user) {
    throw new Error('User not found');
  }
  
  // Get the user profile data from profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (profileError) {
    throw new Error('User profile not found');
  }
  
  const user: User = {
    id: data.user.id,
    name: profileData.name,
    email: data.user.email || '',
    pincode: profileData.pincode || '',
    address: profileData.address || '',
    rewardPoints: profileData.reward_points || 0,
    createdAt: profileData.created_at || new Date().toISOString()
  };
  
  // Store user in localStorage for easy access
  localStorage.setItem('sb-auth-token', data.session?.access_token || '');
  localStorage.setItem('sb-user', JSON.stringify(user));
  
  return user;
};

// Register a new user
export const register = async (data: RegisterData): Promise<User> => {
  // Register with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });
  
  if (authError) {
    throw new Error(authError.message);
  }
  
  if (!authData.user) {
    throw new Error('Registration failed');
  }
  
  // Create user profile in the profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      name: data.name,
      email: data.email,
      pincode: data.pincode,
      address: data.address,
      reward_points: 0,
      created_at: new Date().toISOString()
    });
  
  if (profileError) {
    throw new Error('Error creating user profile');
  }
  
  const user: User = {
    id: authData.user.id,
    name: data.name,
    email: data.email,
    pincode: data.pincode,
    address: data.address,
    rewardPoints: 0,
    createdAt: new Date().toISOString()
  };
  
  // Store user in localStorage for easy access
  localStorage.setItem('sb-auth-token', authData.session?.access_token || '');
  localStorage.setItem('sb-user', JSON.stringify(user));
  
  return user;
};

// Logout the current user
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  localStorage.removeItem('sb-auth-token');
  localStorage.removeItem('sb-user');
};

// Update user data
export const updateUser = async (updatedUser: Partial<User>): Promise<User> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is logged in');
  }
  
  // Update profile in Supabase
  const { error } = await supabase
    .from('profiles')
    .update({
      name: updatedUser.name || currentUser.name,
      pincode: updatedUser.pincode || currentUser.pincode,
      address: updatedUser.address || currentUser.address,
      reward_points: updatedUser.rewardPoints !== undefined 
        ? updatedUser.rewardPoints 
        : currentUser.rewardPoints
    })
    .eq('id', currentUser.id);
  
  if (error) {
    throw new Error('Failed to update user profile');
  }
  
  // Update local user data
  const newUserData = { ...currentUser, ...updatedUser };
  localStorage.setItem('sb-user', JSON.stringify(newUserData));
  
  return newUserData;
};

// Add reward points to user
export const addRewardPoints = async (points: number): Promise<User> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is logged in');
  }
  
  const newPoints = currentUser.rewardPoints + points;
  
  // Update points in Supabase
  const { error } = await supabase
    .from('profiles')
    .update({ reward_points: newPoints })
    .eq('id', currentUser.id);
  
  if (error) {
    throw new Error('Failed to update reward points');
  }
  
  // Update local user data
  const updatedUser = { ...currentUser, rewardPoints: newPoints };
  localStorage.setItem('sb-user', JSON.stringify(updatedUser));
  
  return updatedUser;
};
