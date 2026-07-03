import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Note: To run this script, you may need to use tsx or ts-node:
// npx tsx scripts/seedCoreMock.ts path/to/data.json

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://losiamwzbmzgzizevwjy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_SERVICE_KEY'; 
// Ideally use the service role key for bypassing RLS during seeding
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData(filePath: string) {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    console.log(`Reading data from ${absolutePath}`);
    
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (!data.title || !data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid JSON format. Expected { title: string, questions: [] }");
    }

    console.log(`Creating mock test: ${data.title}`);
    
    // 1. Create Mock Test
    const { data: testData, error: testError } = await supabase
      .from('mock_tests')
      .insert([{
        title: data.title,
        description: data.description || '',
        duration: data.duration || 45,
        total_questions: data.questions.length,
        is_published: true
      }])
      .select()
      .single();

    if (testError) throw testError;
    const testId = testData.id;
    console.log(`Created mock test with ID: ${testId}`);

    // 2. Insert Questions
    console.log(`Inserting ${data.questions.length} questions...`);
    const insertedQuestions = [];

    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      
      const { data: qData, error: qError } = await supabase
        .from('core_test_questions')
        .insert([{
          question_number: q.question_number || (i + 1),
          section: q.section,
          difficulty: q.difficulty || 'medium',
          question_type: q.question_type || 'multiple_choice',
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          hint: q.hint || '',
          estimated_time: q.estimated_time || 60,
          skill: q.skill || '',
          topic: q.topic || '',
          image_url: q.image_url || '',
          is_active: true
        }])
        .select()
        .single();

      if (qError) {
        console.error(`Failed to insert question ${i + 1}:`, qError);
      } else {
        insertedQuestions.push({
          mock_test_id: testId,
          question_id: qData.id,
          display_order: i + 1
        });
      }
    }

    // 3. Link Questions to Mock Test
    console.log('Linking questions to mock test...');
    const { error: linkError } = await supabase
      .from('mock_test_questions')
      .insert(insertedQuestions);

    if (linkError) throw linkError;

    console.log('Seed completed successfully!');

  } catch (error) {
    console.error('Seed failed:', error);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide the path to the JSON file.");
  console.error("Usage: npx tsx scripts/seedCoreMock.ts <path-to-json>");
  process.exit(1);
}

seedData(args[0]);
