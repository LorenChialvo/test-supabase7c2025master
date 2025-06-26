// Environment variables for Supabase
export const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validation check
if (!VITE_SUPABASE_ANON_KEY) {
  console.warn(`
    ⚠️ Supabase Anon Key is not set! ⚠️
    
    Please create a file named ".env.local" in the project root with:
    VITE_SUPABASE_URL=https://your_project_id.supabase.co
    VITE_SUPABASE_ANON_KEY=your_VITE_SUPABASE_ANON_KEY
    
    Then restart your development server.
    
    You can find your API key in your Supabase dashboard under:
    Project Settings > API > Project API keys > anon public
  `);
}
