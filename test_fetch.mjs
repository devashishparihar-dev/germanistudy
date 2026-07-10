import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://losiamwzbmzgzizevwjy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data: tests, error: testErr } = await supabase.from('mock_tests').select('*');
  console.log("Mock Tests:", tests?.map(t => t.id));
  
  if (tests && tests.length > 0) {
    const selectedCoreModule = tests[0].id;
    console.log("Checking mock_test_id:", selectedCoreModule);
    
    const { data: mappings, error: mapError } = await supabase
      .from('mock_test_questions')
      .select(`
        *,
        core_test_questions (
          id,
          section,
          question,
          options,
          correct_answer,
          explanation,
          difficulty
        )
      `)
      .eq('mock_test_id', selectedCoreModule);
      
    console.log("Mappings length:", mappings?.length);
    console.log("Map Error:", mapError);
    if (mappings?.length > 0) {
      console.log("First mapping:", JSON.stringify(mappings[0], null, 2));
    }
  }
}

test();
