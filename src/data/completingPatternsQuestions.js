export const completingPatternsQuestions = [
  {
    section: 'patterns',
    question: "Row 1:\n[ ■ ] [ □ ] [ □ ]\n[ □ ] [ ■ ] [ □ ]\n[ □ ] [ □ ] [ ? ]",
    options: ["[ ■ ]", "[ □ ]", "[ ▤ ]", "[ ▦ ]"],
    correct_answer: "[ ■ ]",
    explanation: "The solid square moves diagonally from top-left to bottom-right across the 3x3 grid. The missing piece must complete this diagonal line."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◯ ] [ ▲ ] [ ◯ ]\n[ ▲ ] [ ◯ ] [ ▲ ]\n[ ◯ ] [ ▲ ] [ ? ]",
    options: ["[ ◯ ]", "[ ▲ ]", "[ △ ]", "[ ⬤ ]"],
    correct_answer: "[ ◯ ]",
    explanation: "The grid follows a strict alternating checkerboard pattern between empty circles and filled triangles. The bottom-right corner must be an empty circle."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ | ] [ / ] [ — ] [ \\ ] [ ? ]",
    options: ["[ | ]", "[ — ]", "[ / ]", "[ \\ ]"],
    correct_answer: "[ | ]",
    explanation: "The line rotates 45 degrees clockwise in each step. After the backslash, the next 45-degree rotation results in a vertical line."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ★ ] [ ★ ★ ] [ ★ ★ ★ ]\n[ △ ] [ △ △ ] [ △ △ △ ]\n[ ◯ ] [ ◯ ◯ ] [ ? ]",
    options: ["[ ◯ ]", "[ ◯ ◯ ]", "[ ◯ ◯ ◯ ]", "[ ◯ ◯ ◯ ◯ ]"],
    correct_answer: "[ ◯ ◯ ◯ ]",
    explanation: "In each row, the number of shapes increases by one from left to right. The third row starts with one circle, then two, so the final cell needs three circles."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ △ ] [ ▷ ] [ ▽ ]\n[ △ ] [ ▷ ] [ ▽ ]\n[ △ ] [ ▷ ] [ ? ]",
    options: ["[ ◁ ]", "[ △ ]", "[ ▽ ]", "[ ▷ ]"],
    correct_answer: "[ ▽ ]",
    explanation: "Each row is identical, with the triangle rotating 90 degrees clockwise from left to right. The last shape in the sequence is a downward-pointing triangle."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◯ ] [ ⬤ ] [ ◯ ]\n[ □ ] [ ■ ] [ □ ]\n[ ◇ ] [ ◆ ] [ ? ]",
    options: ["[ ◇ ]", "[ ◆ ]", "[ ◈ ]", "[ ◯ ]"],
    correct_answer: "[ ◇ ]",
    explanation: "Each row features a shape that is empty on the left, filled in the middle, and empty again on the right. The third row uses diamonds, so the missing shape is an empty diamond."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◐ ] [ ◑ ] [ ⬤ ]\n[ ◒ ] [ ◓ ] [ ⬤ ]\n[ ◐ ] [ ◑ ] [ ? ]",
    options: ["[ ◯ ]", "[ ⬤ ]", "[ ◐ ]", "[ ◒ ]"],
    correct_answer: "[ ⬤ ]",
    explanation: "In each row, two half-filled circles combine to form a completely filled circle in the third column. The third row repeats the first row, resulting in a filled circle."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ △ ] [ □ ] [ ⬠ ] [ ? ]",
    options: ["[ ◯ ]", "[ ⬡ ]", "[ ◇ ]", "[ ☆ ]"],
    correct_answer: "[ ⬡ ]",
    explanation: "The shapes increase in the number of sides: Triangle (3), Square (4), Pentagon (5). The next shape must be a Hexagon (6 sides)."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◁ ] [ △ ] [ ▷ ]\n[ ▽ ] [ ◁ ] [ △ ]\n[ ▷ ] [ ▽ ] [ ? ]",
    options: ["[ ◁ ]", "[ ▷ ]", "[ △ ]", "[ ▽ ]"],
    correct_answer: "[ ◁ ]",
    explanation: "The shapes shift one position to the left as you move down to the next row (with the leftmost wrapping to the right). The bottom-right cell continues this shift to become a left-pointing triangle."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ + ] [ - ] [ × ]\n[ - ] [ × ] [ + ]\n[ × ] [ + ] [ ? ]",
    options: ["[ + ]", "[ - ]", "[ × ]", "[ ÷ ]"],
    correct_answer: "[ - ]",
    explanation: "Each row and column contains exactly one of each symbol (+, -, ×). The third row already has × and +, so the missing symbol must be -."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ ⬤ ◯ ◯ ] [ ◯ ⬤ ◯ ] [ ◯ ◯ ⬤ ] [ ? ]",
    options: ["[ ⬤ ◯ ◯ ]", "[ ◯ ⬤ ◯ ]", "[ ◯ ◯ ⬤ ]", "[ ⬤ ⬤ ◯ ]"],
    correct_answer: "[ ⬤ ◯ ◯ ]",
    explanation: "The filled circle moves one position to the right in each step. After reaching the end, it wraps back to the first position."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ■ ] [ ■ ] [ □ ]\n[ ■ ] [ □ ] [ ■ ]\n[ □ ] [ ■ ] [ ? ]",
    options: ["[ □ ]", "[ ■ ]", "[ ▤ ]", "[ ◯ ]"],
    correct_answer: "[ ■ ]",
    explanation: "In each row, there are exactly two filled squares and one empty square. The third row already has one empty and one filled square, so the missing one must be filled."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ / ] [ \\ ] [ X ]\n[ - ] [ | ] [ + ]\n[ \\ ] [ / ] [ ? ]",
    options: ["[ + ]", "[ X ]", "[ | ]", "[ - ]"],
    correct_answer: "[ X ]",
    explanation: "In each row, the third symbol is formed by superimposing the first two symbols. Superimposing \\ and / creates an X."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ ☆ ] [ ★ ☆ ] [ ☆ ★ ☆ ] [ ? ]",
    options: ["[ ★ ☆ ★ ☆ ]", "[ ☆ ★ ☆ ★ ]", "[ ★ ★ ☆ ☆ ]", "[ ☆ ☆ ★ ★ ]"],
    correct_answer: "[ ★ ☆ ★ ☆ ]",
    explanation: "One star is added at each step, and the colors alternate starting with the newly added star on the left. The sequence grows and alternates: empty, filled-empty, empty-filled-empty, filled-empty-filled-empty."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◯ ] [ △ ] [ □ ]\n[ △ ] [ □ ] [ ◯ ]\n[ □ ] [ ◯ ] [ ? ]",
    options: ["[ ◯ ]", "[ △ ]", "[ □ ]", "[ ◇ ]"],
    correct_answer: "[ △ ]",
    explanation: "Each row and column must contain exactly one circle, one triangle, and one square (a Latin square). The third row is missing a triangle."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◧ ] [ ◨ ] [ ■ ]\n[ ◓ ] [ ◒ ] [ ⬤ ]\n[ ◧ ] [ ◨ ] [ ? ]",
    options: ["[ □ ]", "[ ■ ]", "[ ◯ ]", "[ ⬤ ]"],
    correct_answer: "[ ■ ]",
    explanation: "The first two symbols in a row combine to form the third symbol (left half + right half = full shape). The third row repeats the first row, resulting in a solid square."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ △ ] [ ▽ ] [ △ △ ] [ ▽ ▽ ] [ ? ]",
    options: ["[ △ △ ]", "[ ▽ ▽ ]", "[ △ △ △ ]", "[ ▽ ▽ ▽ ]"],
    correct_answer: "[ △ △ △ ]",
    explanation: "The pattern alternates between upward and downward triangles, while the quantity increases every two steps. The next logical step is three upward triangles."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◇ ] [ ◆ ] [ ◇ ]\n[ ◆ ] [ ◆ ] [ ◆ ]\n[ ◇ ] [ ◆ ] [ ? ]",
    options: ["[ ◇ ]", "[ ◆ ]", "[ ◯ ]", "[ ■ ]"],
    correct_answer: "[ ◇ ]",
    explanation: "The grid forms a symmetrical cross of filled diamonds in the center row and column, with empty diamonds in the four corners. The bottom-right corner must be empty."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ 1 ] [ 2 ] [ 3 ]\n[ 4 ] [ 5 ] [ 6 ]\n[ 7 ] [ 8 ] [ ? ]",
    options: ["[ 8 ]", "[ 9 ]", "[ 10 ]", "[ 0 ]"],
    correct_answer: "[ 9 ]",
    explanation: "A simple sequential numerical pattern. The numbers increase by 1 reading left to right, top to bottom. The missing number is 9."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ↑ ] [ ↗ ] [ → ]\n[ ↖ ] [ ↑ ] [ ↗ ]\n[ ← ] [ ↖ ] [ ? ]",
    options: ["[ ↑ ]", "[ ↗ ]", "[ → ]", "[ ↓ ]"],
    correct_answer: "[ ↑ ]",
    explanation: "The arrows rotate 45 degrees clockwise as you move right across a row. In the third row, ← rotates 45 degrees to ↖, which then rotates 45 degrees to ↑."
  },
  {
    section: 'patterns',
    question: "Row 1:\n[ ◯ ] [ ◯ ◯ ] [ ◯ ]\n[ △ ] [ △ △ ] [ △ ]\n[ □ ] [ □ □ ] [ ? ]",
    options: ["[ □ ]", "[ □ □ ]", "[ □ □ □ ]", "[ ◯ ]"],
    correct_answer: "[ □ ]",
    explanation: "The middle column always contains two of the shapes, while the outer columns contain one. The third row uses squares, so the final column must have one square."
  },
  {
    section: 'patterns',
    question: "Sequence:\n[ A ] [ C ] [ E ] [ G ] [ ? ]",
    options: ["[ H ]", "[ I ]", "[ J ]", "[ K ]"],
    correct_answer: "[ I ]",
    explanation: "The letters skip one letter in the alphabet each time (+2 positions). After G comes H, and then I."
  }
];
