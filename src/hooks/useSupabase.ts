
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useState, useEffect, createContext, useContext } from 'react';

// Create a context for Supabase
type SupabaseContextType = {
  supabase: SupabaseClient | null;
  isInitialized: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isInitialized: false,
  error: null
});

// Provider component to initialize Supabase once
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (supabaseClient) {
      return;
    }
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabaseClient(client);
        console.log('Supabase client initialized successfully');
        setIsInitialized(true);
      } else {
        console.warn('Supabase credentials not found in environment variables');
        setError(new Error('Supabase credentials missing'));
      }
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      setError(err as Error);
    }
  }, []);
  
  return (
    <SupabaseContext.Provider value={{ 
      supabase: supabaseClient, 
      isInitialized, 
      error 
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Hook to use Supabase within components
export const useSupabase = () => {
  return useContext(SupabaseContext);
};
