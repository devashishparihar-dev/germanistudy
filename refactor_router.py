import os
import re

route_map = {
  'Home': '/',
  'Auth': '/auth',
  'Library': '/library',
  'Blogs': '/blogs',
  'Dashboard': '/dashboard',
  'Analytics': '/analytics',
  'Profile': '/profile',
  'Settings': '/settings',
  'admin-panel': '/admin',
  'History': '/history',
  'MockHistory': '/history',
  'digital-core-test': '/simulator/core',
  'digital-subject-test': '/simulator/subject',
  'DigitalSimulator': '/simulator',
  'UnauthPreview': '/simulator/preview',
  'Pricing': '/pricing',
  'PrivacyPolicy': '/privacy-policy',
  'TermsOfService': '/terms-of-service',
  'APSGuide': '/guides/aps',
  'DMATHandbook': '/guides/dmat',
  'StudyCoreFigureSequences': '/study/core/figure-sequences',
  'StudyCoreMathEquations': '/study/core/math-equations',
  'StudyCoreLatinSquares': '/study/core/latin-squares',
  'StudySubjectMath': '/study/subject/math',
  'StudySubjectEngineering': '/study/subject/engineering',
  'StudySubjectNaturalSciences': '/study/subject/natural-sciences',
  'StudySubjectBusiness': '/study/subject/business',
  'StudySubjectEconomics': '/study/subject/economics',
  'StudySubjectSocialSciences': '/study/subject/social-sciences',
  'PracticeCoreFigureSequences': '/practice/core/figure-sequences',
  'PracticeCoreMathEquations': '/practice/core/math-equations',
  'PracticeCoreLatinSquares': '/practice/core/latin-squares',
  'PracticeSubjectMath': '/practice/subject/math',
  'PracticeSubjectEngineering': '/practice/subject/engineering',
  'PracticeSubjectNaturalSciences': '/practice/subject/natural-sciences',
  'PracticeSubjectBusiness': '/practice/subject/business',
  'PracticeSubjectEconomics': '/practice/subject/economics',
  'PracticeSubjectSocialSciences': '/practice/subject/social-sciences',
  'MockTestsFull': '/mocks/full',
  'MockTestsCore': '/mocks/core',
  'MockTestsSubject': '/mocks/subject'
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'setCurrentView' not in content:
        return

    print(f"Processing {filepath}")

    if 'useNavigate' not in content:
        content = re.sub(r'(import React.*?\n)', r'\1import { useNavigate } from \'react-router-dom\';\n', content, count=1)

    content = re.sub(r',\s*setCurrentView', '', content)
    content = re.sub(r'setCurrentView,\s*', '', content)
    content = re.sub(r'\{\s*setCurrentView\s*\}', '()', content)
    
    # Inject useNavigate
    content = re.sub(r'(const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{)', r'\1\n  const navigate = useNavigate();\n', content, count=1)
    content = re.sub(r'(export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)', r'\1\n  const navigate = useNavigate();\n', content, count=1)

    # Replace setCurrentView
    for key, val in route_map.items():
        content = re.sub(r'setCurrentView\([\'"`]' + key + r'[\'"`]\)', f"navigate('{val}')", content)

    content = re.sub(r'setCurrentView\(`BlogPost:\$\{([^}]+)\}`\)', r"navigate(`/blogs/${\1}`)", content)
    content = re.sub(r'setCurrentView\([\'"`]BlogPost:([^\'"`]+)[\'"`]\)', r"navigate('/blogs/\1')", content)
    
    # Optional: Catch any leftover setCurrentView
    content = re.sub(r'setCurrentView\(', r'navigate(', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = os.path.join('e:\\GermaniStudy', 'src')
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx') and file not in ['App.jsx', 'TopNav.jsx']:
            process_file(os.path.join(root, file))

print("Done")
