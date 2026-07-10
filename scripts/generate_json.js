import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all question arrays
import { quantitativeQuestions } from '../src/data/quantitativeQuestions.js';
import { inferringRelationshipsQuestions } from '../src/data/inferringRelationshipsQuestions.js';
import { completingPatternsQuestions } from '../src/data/completingPatternsQuestions.js';
import { continuingNumericalSeriesQuestions } from '../src/data/continuingNumericalSeriesQuestions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Combine them
const allQuestions = [
  ...quantitativeQuestions,
  ...inferringRelationshipsQuestions,
  ...completingPatternsQuestions,
  ...continuingNumericalSeriesQuestions
];

// Add difficulty if missing, default to 1 (or 'medium' depending on your backend enum)
// In AdminPanel it inserts difficulty as a number (1-5).
const formattedQuestions = allQuestions.map(q => ({
  ...q,
  difficulty: q.difficulty || 1 // defaulting to 1 for seed data
}));

const outputPath = path.join(__dirname, '..', 'questions_migration.json');

fs.writeFileSync(outputPath, JSON.stringify(formattedQuestions, null, 2));

console.log(`Successfully compiled ${formattedQuestions.length} questions to questions_migration.json`);
