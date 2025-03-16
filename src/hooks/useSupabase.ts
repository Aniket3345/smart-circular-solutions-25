
import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;

export const useSupabase = () => {
  if (supabaseClient) return supabaseClient;
  
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client initialized');
    } else {
      console.warn('Supabase credentials not found in environment variables');
      // Return null or a mock client if needed
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
  
  return supabaseClient;
};
