
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Declare a global variable to store the Supabase client instance
let supabaseClient: any = null;

export const useSupabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Supabase client if it hasn't been already
  useEffect(() => {
    if (supabaseClient) {
      setIsInitialized(true);
      return;
    }
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        supabaseClient = createClient(supabaseUrl, supabaseKey);
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
  
  return { 
    supabase: supabaseClient, 
    isInitialized, 
    error 
  };
};
