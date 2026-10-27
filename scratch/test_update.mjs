import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rxdxykvpnzwontnmgikb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  // Test reading first
  const { data, error } = await supabase.from('products').select('id, name, category').eq('id', 'c1d52965-8f2c-4de0-ba87-222170b5117f').single();
  console.log('Read test:', { data, error });

  // Test updating Dieovale from Watches to Men's Watches
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ category: "Men's Watches" })
    .eq('id', 'c1d52965-8f2c-4de0-ba87-222170b5117f')
    .select('*');
    
  console.log('Update test result:', { updated, updateError });
}

test();
