
// Simulated authentication service
// In a real application, this would connect to a backend API

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

// Mock users database
const STORAGE_KEY = 'smart_circular_auth';
const USERS_KEY = 'smart_circular_users';

// Helper to get all users from localStorage
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Check if a user is currently logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

// Get the current logged in user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Login a user
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === credentials.email.toLowerCase()
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you would verify the password here
  // This is just a simulation
  
  // Save the logged in user to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  return user;
};

// Register a new user
export const register = async (data: RegisterData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    id: 'user_' + Date.now().toString(),
    name: data.name,
    email: data.email,
    pincode: data.pincode,
    address: data.address,
    rewardPoints: 0,
    createdAt: new Date().toISOString()
  };
  
  // Add to users array and save
  users.push(newUser);
  saveUsers(users);
  
  // Log the user in
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  
  return newUser;
};

// Logout the current user
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Update user data
export const updateUser = (updatedUser: Partial<User>): User => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is logged in');
  }
  
  // Update user in the users array
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === currentUser.id ? { ...user, ...updatedUser } : user
  );
  
  saveUsers(updatedUsers);
  
  // Update current user in localStorage
  const newUserData = { ...currentUser, ...updatedUser };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserData));
  
  return newUserData;
};

// Add reward points to user
export const addRewardPoints = (points: number): User => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is logged in');
  }
  
  const updatedUser = { 
    ...currentUser, 
    rewardPoints: currentUser.rewardPoints + points 
  };
  
  // Update in users array
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === currentUser.id ? updatedUser : user
  );
  
  saveUsers(updatedUsers);
  
  // Update current user in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  
  return updatedUser;
};
