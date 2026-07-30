export const resources = {
  id: 'resources',
  title: 'Study Resources',
  subtitle: 'Where to find the best material',
  estimatedTime: 2,
  content: [
    {
      type: 'text',
      content: 'While GermaniStudy provides a comprehensive simulator, it is beneficial to review official resources.'
    },
    {
      type: 'resource',
      title: 'Official dMAT Sample Questions (PDF)',
      description: 'The official sample questions published by the test makers.',
      link: '#'
    },
    {
      type: 'resource',
      title: 'GermaniStudy Study Materials',
      description: 'Interactive guides and formulas for every section.',
      link: '#StudyCoreMathEquations'
    },
    {
      type: 'warning',
      title: 'Avoid Unverified Material',
      content: 'There is a lot of outdated material online from the paper-based era of the exam. Ensure your practice material is aligned with the new digital format.'
    }
  ]
};
