
import { useState, useEffect, createContext, useContext } from 'react';
import { isAuthenticated as checkAuth } from '@/utils/auth';

// Create a context for auth state
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  error: null
});

// Provider component to initialize auth state
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is logged in using localStorage
    try {
      const isUserAuthenticated = checkAuth();
      setIsAuthenticated(isUserAuthenticated);
      setIsLoading(false);
      console.log("Auth check complete, user authenticated:", isUserAuthenticated);
    } catch (err) {
      console.error('Error checking authentication:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth state within components
export const useSupabase = () => {
  return useContext(AuthContext);
};
