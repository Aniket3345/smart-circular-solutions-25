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

// Make sure localStorage is persisted by setting a longer timeout
const LOCAL_STORAGE_KEY = {
  USERS: 'smart_circular_users',
  REPORTS: 'smart_circular_reports',
  CURRENT_USER: 'smart_circular_user',
  WASTE_REPORTS: 'reported_waste_items',
  FLOOD_REPORTS: 'reported_flood_items',
  ELECTRICITY_REPORTS: 'reported_electricity_items'
};

// Initialize storage for users and reports 
const initializeLocalStorage = () => {
  try {
    // Initialize users if not already present
    if (!localStorage.getItem(LOCAL_STORAGE_KEY.USERS)) {
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
      localStorage.setItem(LOCAL_STORAGE_KEY.USERS, JSON.stringify(defaultUsers));
      console.log("Initialized default users in localStorage");
    }
    
    // Initialize reports if not already present
    if (!localStorage.getItem(LOCAL_STORAGE_KEY.REPORTS)) {
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
      localStorage.setItem(LOCAL_STORAGE_KEY.REPORTS, JSON.stringify(defaultReports));
      console.log("Initialized default reports in localStorage");
    }
  } catch (error) {
    console.error("Error initializing localStorage:", error);
  }
};

// Initialize on module load
initializeLocalStorage();

// Helper function to get users from localStorage
const getUsers = (): User[] => {
  try {
    const usersJSON = localStorage.getItem(LOCAL_STORAGE_KEY.USERS);
    return usersJSON ? JSON.parse(usersJSON) : [];
  } catch (error) {
    console.error('Error getting users from localStorage:', error);
    return [];
  }
};

// Helper function to save users to localStorage
const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY.USERS, JSON.stringify(users));
    console.log("Saved users to localStorage:", users.length);
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Helper function to get reports from localStorage
const getReports = (): Report[] => {
  try {
    const reportsJSON = localStorage.getItem(LOCAL_STORAGE_KEY.REPORTS);
    return reportsJSON ? JSON.parse(reportsJSON) : [];
  } catch (error) {
    console.error('Error getting reports from localStorage:', error);
    return [];
  }
};

// Helper function to save reports to localStorage
const saveReports = (reports: Report[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY.REPORTS, JSON.stringify(reports));
    console.log("Saved reports to localStorage:", reports.length);
  } catch (error) {
    console.error('Error saving reports to localStorage:', error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY.CURRENT_USER);
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
    const userString = localStorage.getItem(LOCAL_STORAGE_KEY.CURRENT_USER);
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
      localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, JSON.stringify(user));
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
    localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, JSON.stringify(newUser));
    
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
    localStorage.removeItem(LOCAL_STORAGE_KEY.CURRENT_USER);
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
    localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, JSON.stringify(updatedUser));
    
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
    localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, JSON.stringify(updatedUser));
    
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

// Save and retrieve user reports
export const saveUserReport = async (report: Report): Promise<boolean> => {
  try {
    // Get all reports
    const reports = getReports();
    
    // Add new report
    reports.push(report);
    
    // Save updated reports
    saveReports(reports);
    
    return true;
  } catch (error) {
    console.error('Save user report error:', error);
    return false;
  }
};

// Get user's reports (including waste, flood, electricity)
export const getUserReports = async (userId: string): Promise<Report[]> => {
  try {
    // Get all reports from localStorage
    const officialReports = getReports();
    const userReports = officialReports.filter(r => r.userId === userId);
    
    // Get user-specific reports from other localStorage items
    const wasteReports = getUserSpecificReports(LOCAL_STORAGE_KEY.WASTE_REPORTS, userId, 'waste');
    const floodReports = getUserSpecificReports(LOCAL_STORAGE_KEY.FLOOD_REPORTS, userId, 'flood');
    const electricityReports = getUserSpecificReports(LOCAL_STORAGE_KEY.ELECTRICITY_REPORTS, userId, 'electricity');
    
    // Combine all reports
    return [...userReports, ...wasteReports, ...floodReports, ...electricityReports];
  } catch (error) {
    console.error('Get user reports error:', error);
    return [];
  }
};

// Get user-specific reports from localStorage
const getUserSpecificReports = (storageKey: string, userId: string, type: 'waste' | 'flood' | 'electricity'): Report[] => {
  try {
    const reportsString = localStorage.getItem(storageKey);
    if (!reportsString) return [];
    
    const reports = JSON.parse(reportsString);
    
    // Convert the specific report format to the general Report format
    return reports.map((item: any) => ({
      id: item.id,
      userId: userId,
      type: type,
      description: item.comment || '',
      imageUrl: item.image,
      status: 'pending',
      timestamp: new Date(item.timestamp).getTime(),
      location: item.location
    }));
  } catch (error) {
    console.error(`Error getting ${type} reports:`, error);
    return [];
  }
};

// Get all reports for admin dashboard
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const officialReports = getReports();
    
    // Get all users to collect their IDs
    const users = getUsers();
    const userIds = users.map(user => user.id);
    
    // Get reports from all storages for all users
    let allUserReports: Report[] = [];
    
    userIds.forEach(userId => {
      const wasteReports = getUserSpecificReports(LOCAL_STORAGE_KEY.WASTE_REPORTS, userId, 'waste');
      const floodReports = getUserSpecificReports(LOCAL_STORAGE_KEY.FLOOD_REPORTS, userId, 'flood');
      const electricityReports = getUserSpecificReports(LOCAL_STORAGE_KEY.ELECTRICITY_REPORTS, userId, 'electricity');
      
      allUserReports = [...allUserReports, ...wasteReports, ...floodReports, ...electricityReports];
    });
    
    return [...officialReports, ...allUserReports];
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
    console.log(`Updating report with ID: ${reportId} to status: ${status}`);
    
    // Get all reports from localStorage
    const reports = getReports();
    
    // Find index of report
    const reportIndex = reports.findIndex(r => r.id === reportId);
    
    if (reportIndex === -1) {
      console.error(`Report with ID ${reportId} not found`);
      return false;
    }
    
    console.log(`Found report at index ${reportIndex}:`, reports[reportIndex]);
    
    // Update report status
    reports[reportIndex] = {
      ...reports[reportIndex],
      status: status
    };
    
    console.log(`Updated report:`, reports[reportIndex]);
    
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
        console.log(`Added 10 points to user ${userId}, new total: ${users[userIndex].rewardPoints}`);
        
        // Save updated users to localStorage
        saveUsers(users);
        
        // If this is the current user, update their data in localStorage
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem(LOCAL_STORAGE_KEY.CURRENT_USER, JSON.stringify(users[userIndex]));
        }
      }
    }
    
    // Save updated reports to localStorage
    saveReports(reports);
    console.log(`Successfully saved updated reports to localStorage`);
    
    return true;
  } catch (error) {
    console.error('Update report status error:', error);
    return false;
  }
};

