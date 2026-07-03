const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://losiamwzbmzgzizevwjy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc'; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearDB() {
  console.log('Clearing old mock tests from database...');
  
  // Try to delete all mock test relationships
  const { error: err1 } = await supabase.from('mock_test_questions').delete().neq('mock_test_id', '00000000-0000-0000-0000-000000000000');
  if (err1) console.error("Error deleting relationships:", err1.message);

  // Try to delete all questions
  const { error: err2 } = await supabase.from('core_test_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err2) console.error("Error deleting questions:", err2.message);

  // Try to delete all mock tests
  const { error: err3 } = await supabase.from('mock_tests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err3) console.error("Error deleting mock tests:", err3.message);

  console.log('Wipe script finished.');
}

clearDB();
