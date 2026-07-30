export const examDay = {
  id: 'examDay',
  title: 'Exam Day',
  subtitle: 'What to expect when you arrive at the test center',
  estimatedTime: 4,
  content: [
    {
      type: 'timeline',
      steps: [
        { title: 'Arrival', description: 'Arrive at least 45 minutes before the scheduled start time.' },
        { title: 'ID Verification', description: 'Present your original passport and admission ticket.' },
        { title: 'Security Check', description: 'All personal belongings (phones, watches, bags) must be stored in a locker.' },
        { title: 'Instructions', description: 'The proctor will read the official rules.' },
        { title: 'Exam Begins', description: 'You will log into the testing system and begin the Core Test.' }
      ]
    },
    {
      type: 'success',
      title: 'The Short Break',
      content: 'There is usually a short break between the Core Test and the Subject-Specific Test. Use this time to hydrate and stretch. Do not discuss questions with other candidates.'
    }
  ]
};
