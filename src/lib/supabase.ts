import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qkubbestfkkzijrsizaf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdWJiZXN0ZmtremlqcnNpemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjY2MDUsImV4cCI6MjA3NjgwMjYwNX0.axeExd65QERcalx0DVbkWtBdqRlSKV0h_7aM-5VVuPU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdWJiZXN0ZmtremlqcnNpemFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIyNjYwNSwiZXhwIjoyMDc2ODAyNjA1fQ.kREJ6ixFkHTQMUd0dNHiflw1YZYSn3nVbNHSVE_mWZU");