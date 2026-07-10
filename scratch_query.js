import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://losiamwzbmzgzizevwjy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  try {
    const { data: mocks, error: err1 } = await supabase
      .from('mock_tests')
      .select('id, title');
    
    console.log("Mock Tests:", mocks);
    
    if (mocks && mocks.length > 0) {
      const latestMock = mocks[mocks.length - 1];
      const { data: mappings, error: err2 } = await supabase
        .from('mock_test_questions')
        .select(`
          core_test_questions (
            section,
            question
          )
        `)
        .eq('mock_test_id', latestMock.id);
      
      console.log(`Questions in Mock "${latestMock.title}":`, mappings);
    }
  } catch (e) {
    console.error(e);
  }
}

main();
