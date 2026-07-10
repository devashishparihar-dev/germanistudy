export const latinSquaresQuestions = [
  {
    id: 'ls_1',
    section: 'latin_squares',
    question: 'In a 4x4 Latin Square using letters A, B, C, D, the first row is A, B, C, D. The second row starts with B, C. What is the last letter of the second row?',
    options: ['A', 'B', 'C', 'D'],
    correct_answer: 'A',
    explanation: 'A Latin square must have each letter exactly once per row and column. The second row starts B, C. The remaining letters are A and D. Since the last column top element is D, the last element of the second row must be A to avoid duplicating D in the last column.'
  }
];
