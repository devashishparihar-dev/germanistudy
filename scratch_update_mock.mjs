import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://losiamwzbmzgzizevwjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateMock() {
  const { data, error } = await supabase
    .from('mock_tests')
    .select('id, title, section');
    
  if (error) {
    console.error('Error fetching mocks:', error);
    return;
  }
  
  console.log('Current mocks:', data);
  
  // Find the math mock
  const mathMock = data.find(m => m.title.toLowerCase().includes('math') || m.title.includes('Mathematical'));
  
  if (mathMock) {
    console.log(`Found math mock to update: ${mathMock.title} (ID: ${mathMock.id})`);
    
    // We can't update directly using anon key due to RLS probably, 
    // Wait, earlier we found out RLS blocks delete, does it block update?
    const { error: updateError } = await supabase
      .from('mock_tests')
      .update({ section: 'mathematical_equations' })
      .eq('id', mathMock.id);
      
    if (updateError) {
      console.error('Failed to update via API (RLS probably):', updateError);
    } else {
      console.log('Successfully updated via API!');
    }
  } else {
    console.log('No math mock found.');
  }
}

updateMock();
