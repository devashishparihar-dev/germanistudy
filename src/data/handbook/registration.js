export const registration = {
  id: 'registration',
  title: 'Registration',
  subtitle: 'How to secure your exam date',
  estimatedTime: 5,
  content: [
    {
      type: 'text',
      content: 'The registration process is strict and deadlines are unforgiving. Follow this timeline carefully.'
    },
    {
      type: 'timeline',
      steps: [
        { title: 'Create Account', description: 'Register on the official portal using the exact name on your passport.' },
        { title: 'Select Test Center', description: 'Choose a test center in your home country. Seats fill up fast.' },
        { title: 'Payment', description: 'Pay the examination fee via credit card or international bank transfer.' },
        { title: 'Confirmation', description: 'Receive your official admission ticket via email.' }
      ]
    },
    {
      type: 'warning',
      title: 'Important Note on Passports',
      content: 'Your registration name MUST exactly match your passport. If it does not, you will be denied entry on exam day without a refund.'
    }
  ]
};
