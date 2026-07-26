import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://losiamwzbmzgzizevwjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'parihardevashish30@gmail.com',
    password: 'tatakaye',
  });
  
  if (authData?.user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', authData.user.id);
    console.log(data);
  } else {
    console.log('Login failed');
  }
}
run();
