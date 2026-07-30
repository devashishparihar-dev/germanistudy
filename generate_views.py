import os

views_dir = r"e:\GermaniStudy\src\views"

categories = {
    "study": [
        "StudyCoreFigureSequences",
        "StudyCoreMathEquations",
        "StudyCoreLatinSquares",
        "StudySubjectMath",
        "StudySubjectEngineering",
        "StudySubjectNaturalSciences",
        "StudySubjectBusiness",
        "StudySubjectEconomics",
        "StudySubjectSocialSciences"
    ],
    "practice": [
        "PracticeCoreFigureSequences",
        "PracticeCoreMathEquations",
        "PracticeCoreLatinSquares",
        "PracticeSubjectMath",
        "PracticeSubjectEngineering",
        "PracticeSubjectNaturalSciences",
        "PracticeSubjectBusiness",
        "PracticeSubjectEconomics",
        "PracticeSubjectSocialSciences"
    ],
    "mocks": [
        "MockTestsFull",
        "MockTestsCore",
        "MockTestsSubject"
    ]
}

template = """import React from 'react';
import ExamSidebar from '../../components/ExamSidebar';
import { motion } from 'framer-motion';

const {name} = ({ setCurrentView }) => {
  return (
    <div className="view-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <ExamSidebar setCurrentView={setCurrentView} />
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '40px', background: 'var(--surface)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>{formatted_name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>This is the dedicated hub for {formatted_name}. Future notes, practice sets, and video lessons will be integrated here.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default {name};
"""

def split_camel_case(s):
    res = []
    for c in s:
        if c.isupper():
            res.append(' ')
        res.append(c)
    return ''.join(res).strip()

for folder, files in categories.items():
    folder_path = os.path.join(views_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    for file_name in files:
        file_path = os.path.join(folder_path, f"{file_name}.jsx")
        formatted = split_camel_case(file_name)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(template.replace("{name}", file_name).replace("{formatted_name}", formatted))
        print(f"Created {file_path}")
