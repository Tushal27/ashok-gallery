import{ createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://giopkcxwcsrfsqzgeedk.supabase.co";
const supabasekey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb3BrY3h3Y3NyZnNxemdlZWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTYwNjUsImV4cCI6MjA2Njg3MjA2NX0.MPyu4bCdoFYCJXz1WvhSmaB5KkxOwrbWzgZiw4CrwYk";
export const supabase = createClient(supabaseUrl, supabasekey);