import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ctbxsagrexxqpajjeqga.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YnhzYWdyZXh4cXBhamplcWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzU2OTgsImV4cCI6MjA3ODQ1MTY5OH0.CP166u7LUfR3i-G8xhXQp1OTOPPWiet6TD0MtXsxM48";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function main() {
  console.log("Trying to login user.hepta@gmail.com with Hepta@2026!");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user.hepta@gmail.com',
    password: 'Hepta@2026!',
  });

  if (error) {
    console.error("Login Error:", error.message);
  } else {
    console.log("Success! Logged in.");
  }
}

main();
