export const eligibility = {
  id: 'eligibility',
  title: 'Eligibility',
  subtitle: 'Are you qualified to take the dMAT?',
  estimatedTime: 3,
  content: [
    {
      type: 'text',
      content: 'Before you begin studying, it is critical to ensure you meet the eligibility criteria for the exam and understand the APS requirement.'
    },
    {
      type: 'warning',
      title: 'The APS Requirement',
      content: 'For students from certain countries (such as India and China), the APS (Akademische Prüfstelle) certificate is mandatory before you can apply for a student visa. Some universities require the APS certificate just to apply.'
    },
    {
      type: 'checklist',
      title: 'Eligibility Checklist',
      items: [
        'You have completed or are in your final year of high school (12th grade equivalent)',
        'You have a valid passport (required for registration)',
        'You intend to apply for a Bachelor’s degree in Germany'
      ]
    }
  ]
};
