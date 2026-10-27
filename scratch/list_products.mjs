import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://rxdxykvpnzwontnmgikb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error:', error);
    return;
  }
  fs.writeFileSync('scratch/all_products.json', JSON.stringify(data, null, 2));
  console.log(`Saved ${data.length} products to scratch/all_products.json`);
}

main();
