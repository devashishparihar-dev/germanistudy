import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

// Load environment variables (expecting GEMINI_API_KEY)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PDF_PATH = path.resolve(__dirname, '../../data/core_test.pdf');
const OUTPUT_JSON = path.resolve(__dirname, '../data/extracted_questions.json');

async function processPdf() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF not found at ${PDF_PATH}. Please make sure you've uploaded it.`);
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error(`❌ GEMINI_API_KEY is missing from .env.local!`);
    process.exit(1);
  }

  console.log('📄 Loading PDF...');
  const dataBuffer = fs.readFileSync(PDF_PATH);
  
  // For the first dry run, we might want to limit the page processing natively.
  // pdfParse has a max page limit option.
  const data = await pdfParse(dataBuffer, { max: 5 }); // limit to first 5 pages for verification
  
  console.log(`✅ Extracted ${data.numrender} pages of text.`);
  console.log('🤖 Sending chunk to AI for extraction and generation...');

  const prompt = `
    Analyze the following extracted text from a cognitive reasoning test.
    Identify any multiple-choice questions. For each question identified, DO NOT copy it exactly.
    Instead, generate a completely NEW, UNIQUE variant that tests the exact same logical reasoning pattern, difficulty, and structure.

    Return the generated questions as a JSON array of objects with the following schema:
    [
      {
        "section": "patterns|quantitative|relationships|numerical_series",
        "question": "The generated question text.",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "The exact string from options that is correct.",
        "explanation": "A detailed explanation of how to solve the question."
      }
    ]

    Here is the extracted text:
    ---
    ${data.text}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsedQuestions = JSON.parse(jsonText);
    
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(parsedQuestions, null, 2));
    console.log(`✅ Successfully generated ${parsedQuestions.length} unique questions.`);
    console.log(`💾 Saved to ${OUTPUT_JSON}`);
    
    // In the next step, we will add logic to seed this directly into Supabase.

  } catch (error) {
    console.error('❌ Error during AI generation:', error);
  }
}

processPdf();
