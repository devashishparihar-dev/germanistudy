export const latinSquaresQuestions = [
  {
    "id": "ls_001",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, "B", "E", null],
        [null, null, "D", null, "B"],
        ["?", "C", null, null, null],
        [null, "B", null, "D", "A"],
        [null, null, null, "B", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "B",
    "explanation": "B is already present in every other row and column, so it must fill the question mark's position (row 3, column α).",
    "task_type": "1a"
  },
  {
    "id": "ls_002",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, null, "C", "D"],
        ["E", "C", "D", null, null],
        [null, "D", null, "A", null],
        [null, null, "E", "?", "C"],
        ["D", null, null, "E", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "D",
    "explanation": "D is already present in every other row and column, so it must fill the question mark's position (row 4, column δ).",
    "task_type": "1a"
  },
  {
    "id": "ls_003",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "D", null, null, null],
        ["?", null, "E", "D", "B"],
        ["D", "A", null, "B", null],
        ["B", null, "A", null, null],
        [null, "B", null, "A", "C"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "A",
    "explanation": "Row 2 is missing only A and C. Since C already appears in column β, C must go at position β2, leaving A for the question mark.",
    "task_type": "1b"
  },
  {
    "id": "ls_004",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["E", null, "B", null, "C"],
        [null, null, "E", "A", null],
        ["A", "E", null, "B", "D"],
        ["D", null, "A", null, "?"],
        [null, "C", "D", "E", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "E",
    "explanation": "E is already present in every other row and column, so it must fill the question mark's position (row 4, column ε).",
    "task_type": "1a"
  },
  {
    "id": "ls_005",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["?", null, null, null, "A"],
        ["A", "B", "E", "C", "D"],
        ["E", "D", "B", "A", "C"],
        ["D", "A", "C", "B", "E"],
        [null, null, "A", "D", "B"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "B",
    "explanation": "Column α is missing only B and C. Since C already appears in row 1's remaining fields via row logic, only B can be placed at the question mark.",
    "task_type": "1b"
  },
  {
    "id": "ls_006",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "low",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, null, "E", null],
        ["E", "C", null, "B", null],
        ["C", null, null, null, null],
        [null, null, null, "D", "C"],
        [null, null, null, "?", "E"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "C",
    "explanation": "Column δ is missing A and C. Since A already appears in row 3, A must go at δ3, leaving C for the question mark at δ5.",
    "task_type": "1b"
  },
  {
    "id": "ls_007",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["E", null, "B", null, null],
        [null, "D", null, null, "A"],
        [null, "E", "?", null, "D"],
        ["A", "B", "D", null, null],
        [null, null, null, "A", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "A",
    "explanation": "Column β is missing A and C. A can only go at β1 (row 5 already has A elsewhere), so C fills β5. A is then present in every row and column except the question mark's position.",
    "task_type": "2a"
  },
  {
    "id": "ls_008",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["E", "C", null, null, "B"],
        ["D", null, null, "?", null],
        ["C", null, "B", null, "D"],
        [null, "E", "A", null, null],
        [null, "D", null, null, "E"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "C",
    "explanation": "Working through column ε and column α first pins down A and B in row 4 and row 5, which leaves C as the only letter that can fill δ2.",
    "task_type": "2b"
  },
  {
    "id": "ls_009",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, "?", "A", "D"],
        ["D", "E", null, "C", "A"],
        [null, null, null, null, null],
        [null, null, null, "E", null],
        ["E", "D", null, null, "C"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "E",
    "explanation": "Row 1 already has A and D, and column γ has no other letters filled in beyond what's needed to rule out B, C, D — the exclusion principle across row 1 and column γ leaves only E.",
    "task_type": "2a"
  },
  {
    "id": "ls_010",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, "E", "D", "A"],
        ["?", null, null, "B", null],
        [null, "E", null, "C", "D"],
        [null, "C", null, "A", null],
        [null, null, "A", "E", "C"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "D",
    "explanation": "Completing column β and column γ step by step eventually leaves D as the only letter missing from both row 2 and column α.",
    "task_type": "2b"
  },
  {
    "id": "ls_011",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["B", "E", null, null, null],
        ["A", "?", null, "C", null],
        ["C", "D", null, null, "E"],
        [null, null, "C", null, "B"],
        [null, null, null, "B", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "B",
    "explanation": "Row 3 is missing A and B; A can only go at δ3, leaving B for γ3. B then turns out to be present in every row and column except the question mark's position.",
    "task_type": "2a"
  },
  {
    "id": "ls_012",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "B", "A", null, "C"],
        ["E", "C", null, null, null],
        ["B", null, null, "A", null],
        [null, null, "?", "C", null],
        ["C", null, "E", null, "D"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "D",
    "explanation": "Filling column α first (only C is missing there) cascades through row 1 and column δ, leaving D as the only option for γ4.",
    "task_type": "2b"
  },
  {
    "id": "ls_013",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "medium",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "C", null, "B", null],
        ["C", null, "A", null, null],
        [null, null, null, "A", null],
        [null, "A", "D", null, "C"],
        [null, null, "B", "?", "A"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "C",
    "explanation": "Column δ is missing C and D; D can only go at δ2, leaving C present in every other row and column except the question mark's position.",
    "task_type": "2a"
  },
  {
    "id": "ls_014",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["C", "A", "E", null, null],
        [null, null, null, "?", null],
        [null, null, "B", "A", null],
        [null, "B", null, null, "C"],
        [null, null, "D", "C", "B"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "E",
    "explanation": "A multi-step chain through column γ, then row 3's column β, and finally column δ narrows the field down until only E can fill δ2.",
    "task_type": "3"
  },
  {
    "id": "ls_015",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, null, "A", "D", "C"],
        [null, null, null, "C", null],
        ["B", null, null, "A", "D"],
        ["D", null, "B", null, "A"],
        [null, "?", null, null, null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "A",
    "explanation": "Working through row 4's column δ, row 3's column β, and column ε in sequence eventually leaves A as the only possibility for β5.",
    "task_type": "3"
  },
  {
    "id": "ls_016",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["C", null, "?", null, null],
        [null, "E", null, "B", null],
        ["E", null, null, null, null],
        [null, "D", null, "A", "C"],
        ["D", null, null, "E", "A"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "A",
    "explanation": "A multi-step chain through row 4, column α, and column ε progressively fills in enough of the grid that A becomes the only option left for γ1.",
    "task_type": "3"
  },
  {
    "id": "ls_017",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        ["D", null, "E", "B", null],
        [null, null, "D", "A", null],
        ["A", null, "B", null, "D"],
        [null, null, null, "E", "A"],
        ["E", "?", null, null, null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "C",
    "explanation": "Completing column γ and row 4 in sequence isolates the missing letters in row 5 and column β down to a single possibility: C.",
    "task_type": "3"
  },
  {
    "id": "ls_018",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "D", null, "A", null],
        [null, null, null, "B", null],
        [null, null, "B", null, "?"],
        ["A", "B", "C", null, null],
        ["B", "C", null, null, "A"]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "D",
    "explanation": "Filling column β, row 1, and row 3 step by step leaves row 4's C and D as the last undetermined pair, resolved by column δ down to D for the question mark.",
    "task_type": "3"
  },
  {
    "id": "ls_019",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "B", null, "D", null],
        ["D", null, "?", null, null],
        ["B", null, null, "C", "D"],
        ["A", null, null, null, "E"],
        [null, "E", null, "A", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "B",
    "explanation": "A multi-step chain through row 4, column β, row 2, and column γ eventually pins B as the only letter left for γ2.",
    "task_type": "3"
  },
  {
    "id": "ls_020",
    "section": "latin_squares",
    "type": "single_choice",
    "difficulty": "high",
    "grid": {
      "columns": ["α", "β", "γ", "δ", "ε"],
      "rows": [
        [null, "C", null, "A", "E"],
        ["A", null, "B", null, "C"],
        ["?", "A", null, null, null],
        [null, null, null, null, null],
        [null, null, "A", "D", null]
      ]
    },
    "question": "Which letter replaces the question mark?",
    "options": ["A", "B", "C", "D", "E"],
    "correct_answer": "E",
    "explanation": "Working through row 2, column ε, row 1, and row 5 in turn fills enough of the grid that E becomes the only remaining option for α3.",
    "task_type": "3"
  }
];
