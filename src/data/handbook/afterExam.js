export const afterExam = {
  id: 'afterExam',
  title: 'After the Exam',
  subtitle: 'Results, APS, and University Applications',
  estimatedTime: 2,
  content: [
    {
      type: 'text',
      content: 'Your journey does not end when you leave the test center.'
    },
    {
      type: 'timeline',
      steps: [
        { title: 'Receiving Results', description: 'Results are typically published 4 weeks after the exam date.' },
        { title: 'APS Certificate', description: 'If applicable, upload your dMAT results to your APS portal.' },
        { title: 'University Applications', description: 'Begin submitting applications via uni-assist or directly to the universities.' }
      ]
    },
    {
      type: 'success',
      title: 'Next Steps',
      content: 'Once your applications are submitted, you can start preparing for your visa interview and looking for accommodation.'
    }
  ]
};
