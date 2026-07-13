import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // 1. Create a client to verify the user token
    const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Parse request body
    const { mock_test_id, answers } = await req.json()
    // answers format: [{ question_id: "uuid", selected_answer: "string" | number }]

    if (!mock_test_id || !Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: 'Invalid payload: mock_test_id and answers array required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract all question IDs that the user submitted answers for
    const questionIds = answers.map((a: any) => a.question_id).filter(Boolean)

    if (questionIds.length === 0) {
        return new Response(JSON.stringify({ error: 'No valid questions submitted' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    // 3. Fetch the correct answers using Service Role Key to ensure we bypass any RLS that might hide correct_answers
    const supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: questions, error: qError } = await supabaseAdminClient
      .from('core_test_questions')
      .select('id, section, type:question_type, options, correct_answer, explanation')
      .in('id', questionIds)

    if (qError) {
      console.error('Error fetching questions:', qError)
      return new Response(JSON.stringify({ error: 'Error fetching grading rubric' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Grade the exam
    let totalScore = 0
    const sectionStats: Record<string, { correct: number; total: number }> = {}
    const questionResults = []

    // Pre-populate section stats for all fetched questions
    questions.forEach((q) => {
      const sec = q.section || 'unknown'
      if (!sectionStats[sec]) sectionStats[sec] = { correct: 0, total: 0 }
      sectionStats[sec].total += 1
    })

    for (const ans of answers) {
      const qId = ans.question_id
      const userAns = ans.selected_answer

      const questionData = questions.find((q) => q.id === qId)
      if (!questionData) continue // Skip if invalid question id

      let isCorrect = false
      let expectedAnswerText = questionData.correct_answer

      if (userAns !== null && userAns !== undefined && userAns !== '') {
        if (questionData.type === 'input') {
          // Direct string comparison
          isCorrect = String(userAns).trim().toLowerCase() === String(expectedAnswerText).trim().toLowerCase()
        } else {
          // Multiple choice: userAns is an index
          const ansIndex = parseInt(userAns, 10)
          if (!isNaN(ansIndex) && questionData.options && questionData.options[ansIndex]) {
            isCorrect = questionData.options[ansIndex] === expectedAnswerText
          }
        }
      }

      if (isCorrect) {
        totalScore++
        const sec = questionData.section || 'unknown'
        sectionStats[sec].correct += 1
      }

      questionResults.push({
        question_id: qId,
        selected_answer: userAns,
        correct_answer: expectedAnswerText,
        is_correct: isCorrect,
        explanation: questionData.explanation || null
      })
    }

    const sectionBreakdown = Object.keys(sectionStats).map(sec => ({
      section: sec,
      correct: sectionStats[sec].correct,
      total: sectionStats[sec].total
    }))

    // Calculate completion percentage
    const answeredCount = answers.filter((a: any) => a.selected_answer !== null && a.selected_answer !== '').length
    const completionPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

    // Format selected_answers for the DB
    const selectedAnswersDbFormat = answers.reduce((acc: any, curr: any) => {
      acc[curr.question_id] = curr.selected_answer
      return acc
    }, {})

    // 5. Insert into mock_test_results
    const { error: insertError } = await supabaseAdminClient
      .from('mock_test_results')
      .insert({
        user_id: user.id,
        mock_test_id: mock_test_id,
        selected_answers: selectedAnswersDbFormat,
        score: totalScore,
        completion_percentage: completionPercentage
      })

    if (insertError) {
      console.error('Error saving mock test result:', insertError)
      // Even if saving fails, we might still want to return the grade to the user
      // But we should probably return a 500
      return new Response(JSON.stringify({ error: 'Failed to save test result' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 6. Construct response
    const responsePayload = {
      score: totalScore,
      section_breakdown: sectionBreakdown,
      question_results: questionResults
    }

    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
