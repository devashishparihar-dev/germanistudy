export const faq = {
  id: 'faq',
  title: 'Frequently Asked Questions',
  subtitle: 'Everything else you need to know',
  estimatedTime: 6,
  content: [
    {
      type: 'accordion',
      items: [
        { question: 'Is there negative marking?', answer: 'No. You should always guess if you run out of time.' },
        { question: 'Can I use a calculator?', answer: 'No. All calculations must be done mentally or on the digital scratchpad.' },
        { question: 'How long are the results valid?', answer: 'The dMAT results do not expire, but universities typically prefer results from the last 2-3 years.' },
        { question: 'Can I retake the exam?', answer: 'Yes, but some universities may look at your first attempt. Always check university guidelines.' },
        { question: 'What if I encounter a technical issue during the exam?', answer: 'Raise your hand immediately. The proctor will assist you or log the issue.' },
        { question: 'How is the Percentile Rank calculated?', answer: 'It compares your score against everyone else who took the test in that specific year.' }
      ]
    }
  ]
};
