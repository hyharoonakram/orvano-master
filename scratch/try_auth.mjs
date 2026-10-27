import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxdxykvpnzwontnmgikb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function tryAuth() {
  const emails = ['admin@orvano.com', 'admin@wearorvano.com', 'admin@admin.com', 'orvano@gmail.com', 'info@wearorvano.com'];
  for (const email of emails) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'admin'
    });
    if (!error) {
      console.log('SUCCESS with:', email);
      return;
    }
    const { data: d2, error: e2 } = await supabase.auth.signInWithPassword({
      email,
      password: 'password'
    });
    if (!e2) {
      console.log('SUCCESS with:', email, 'password');
      return;
    }
  }
  console.log('No default password matched.');
}

tryAuth();
