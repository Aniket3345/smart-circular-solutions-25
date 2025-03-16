
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

// Initialize storage for users and reports 
const initializeLocalStorage = () => {
  // Initialize users if not already present
  if (!localStorage.getItem('users')) {
    const defaultUsers = [
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
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  // Initialize reports if not already present
  if (!localStorage.getItem('reports')) {
    const defaultReports = [
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
    localStorage.setItem('reports', JSON.stringify(defaultReports));
  }
};

// Initialize on module load
initializeLocalStorage();

// Helper function to get users from localStorage
const getUsers = (): User[] => {
  try {
    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

// Helper function to save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Helper function to get reports from localStorage
const getReports = (): Report[] => {
  try {
    const reportsJSON = localStorage.getItem('reports');
    return reportsJSON ? JSON.parse(reportsJSON) : [];
  } catch (error) {
    console.error('Error getting reports from localStorage:', error);
    return [];
  }
};

// Helper function to save reports to localStorage
const saveReports = (reports: Report[]): void => {
  try {
    localStorage.setItem('reports', JSON.stringify(reports));
  } catch (error) {
    console.error('Error saving reports to localStorage:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
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
    console.log("Logging in with:", credentials);
    
    // Get all users from localStorage
    const users = getUsers();
    
    // Find user with matching email (in a real app, we would check password hash)
    const user = users.find(user => user.email === credentials.email);
    
    if (user) {
      // Set current user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      console.log("Login successful:", user);
      return user;
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
    console.log("Registering new user with:", userData);
    
    // Get existing users from localStorage
    const users = getUsers();
    
    // Check if user with this email already exists
    if (users.some(user => user.email === userData.email)) {
      console.error('A user with this email already exists');
      return null;
    }
    
    // Create new user
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
    
    // Add new user to users array
    users.push(newUser);
    
    // Save updated users to localStorage
    saveUsers(users);
    
    // Set current user in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    
    console.log("Registration successful:", newUser);
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  try {
    localStorage.removeItem('user');
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
    
    // Get all users from localStorage
    const users = getUsers();
    
    // Find index of current user
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return null;
    
    // Update user object
    const updatedUser = {
      ...currentUser,
      name: userData.name || currentUser.name,
      pincode: userData.pincode || currentUser.pincode,
      address: userData.address || currentUser.address,
    };
    
    // Update users array
    users[userIndex] = updatedUser;
    
    // Save updated users to localStorage
    saveUsers(users);
    
    // Update current user in localStorage
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
    
    // Get all users from localStorage
    const users = getUsers();
    
    // Find index of current user
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return null;
    
    // Update user's reward points
    const updatedUser = {
      ...currentUser,
      rewardPoints: currentUser.rewardPoints + points,
    };
    
    // Update users array
    users[userIndex] = updatedUser;
    
    // Save updated users to localStorage
    saveUsers(users);
    
    // Update current user in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Add reward points error:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    return getUsers();
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user || null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    return null;
  }
};

// Get user's reports
export const getUserReports = async (userId: string): Promise<Report[]> => {
  try {
    const reports = getReports();
    return reports.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Get user reports error:', error);
    return [];
  }
};

// Get all reports
export const getAllReports = async (): Promise<Report[]> => {
  try {
    return getReports();
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
    // Get all reports from localStorage
    const reports = getReports();
    
    // Find index of report
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1) return false;
    
    // Update report status
    reports[reportIndex].status = status;
    
    // If report is approved, add points to user
    if (status === 'approved') {
      const userId = reports[reportIndex].userId;
      
      // Get all users from localStorage
      const users = getUsers();
      
      // Find index of user
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        // Add 10 points to user
        users[userIndex].rewardPoints += 10;
        
        // Save updated users to localStorage
        saveUsers(users);
        
        // If this is the current user, update their data in localStorage
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem('user', JSON.stringify(users[userIndex]));
        }
      }
    }
    
    // Save updated reports to localStorage
    saveReports(reports);
    
    return true;
  } catch (error) {
    console.error('Update report status error:', error);
    return false;
  }
};
