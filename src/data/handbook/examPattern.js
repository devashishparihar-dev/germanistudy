export const examPattern = {
  id: 'examPattern',
  title: 'Exam Pattern',
  subtitle: 'Understanding the structure of the dMAT',
  estimatedTime: 6,
  content: [
    {
      type: 'text',
      content: 'The dMAT is a purely computer-based exam. You will not have access to a calculator or scratch paper. Everything must be solved mentally or using the provided digital scratchpad.'
    },
    {
      type: 'info',
      title: 'Scoring & Percentiles',
      content: 'Your score is calculated based on the number of correct answers. There is no negative marking. The most important metric is your Percentile Rank, which shows how you performed relative to all other test-takers globally.'
    },
    {
      type: 'table',
      title: 'Core Module Structure',
      headers: ['Section', 'Questions', 'Time'],
      rows: [
        ['Quantitative Problems', '22', '45 min'],
        ['Inferring Relationships', '22', '10 min'],
        ['Completing Patterns', '22', '20 min']
      ]
    },
    {
      type: 'warning',
      title: 'Strict Timing',
      content: 'Each section is individually timed. Once the time for a section expires, you are automatically moved to the next one. You cannot go back to previous sections.'
    }
  ]
};
