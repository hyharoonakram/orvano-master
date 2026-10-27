import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxdxykvpnzwontnmgikb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users, error } = await supabase.from('users').select('*');
  console.log('Users:', users, error);
}

check();
