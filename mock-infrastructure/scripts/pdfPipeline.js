const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PDF_PATH = path.resolve(__dirname, '../../data/core_test.pdf');
const OUTPUT_TXT = path.resolve(__dirname, '../../data/core_test_full.txt');

async function processPdf() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`❌ PDF not found at ${PDF_PATH}. Please make sure you've uploaded it.`);
    process.exit(1);
  }

  console.log('📄 Loading PDF...');
  const dataBuffer = fs.readFileSync(PDF_PATH);
  
  // Extract ALL pages
  const data = await pdfParse(dataBuffer); 
  
  console.log(`✅ Extracted ${data.numrender} pages of text.`);
  
  // Ensure the output directory exists
  if (!fs.existsSync(path.dirname(OUTPUT_TXT))) {
    fs.mkdirSync(path.dirname(OUTPUT_TXT), { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_TXT, data.text);
  console.log(`💾 Saved extracted text to ${OUTPUT_TXT}`);
}

processPdf();
