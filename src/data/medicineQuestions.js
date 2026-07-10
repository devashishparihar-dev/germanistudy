export const medicineQuestions = [
  {
    id: 'med_testlet_1',
    section: 'medicine',
    type: 'testlet',
    title: 'The Human Cardiovascular System',
    passage: `The cardiovascular system consists of the heart, blood vessels, and blood. Its primary function is to transport nutrients, oxygen, and hormones to cells throughout the body and remove metabolic wastes such as carbon dioxide and nitrogenous wastes.

The heart has four chambers: the right and left atria (upper chambers) and the right and left ventricles (lower chambers). Deoxygenated blood enters the right atrium through the vena cava, flows into the right ventricle, and is pumped to the lungs for oxygenation. Oxygen-rich blood returns to the left atrium, moves into the left ventricle, and is pumped out to the rest of the body through the aorta.`,
    questions: [
      {
        id: 'med_1',
        question: 'Which chamber of the heart pumps oxygenated blood to the entire body?',
        options: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'],
        correct_answer: 'Left Ventricle',
        explanation: 'The passage states that oxygen-rich blood moves into the left ventricle and is pumped out to the rest of the body.'
      },
      {
        id: 'med_2',
        question: 'What type of blood enters the right atrium?',
        options: ['Oxygenated', 'Deoxygenated', 'Nutrient-rich', 'Metabolic waste-free'],
        correct_answer: 'Deoxygenated',
        explanation: 'Deoxygenated blood enters the right atrium through the vena cava.'
      },
      {
        id: 'med_3',
        question: 'Which of the following is NOT a primary function of the cardiovascular system?',
        options: ['Transporting oxygen', 'Removing carbon dioxide', 'Digesting food', 'Transporting hormones'],
        correct_answer: 'Digesting food',
        explanation: 'Digestion is not a function of the cardiovascular system.'
      }
    ]
  }
];
