const fs = require('fs');
const path = require('path');

const files = [
  'src/components/ExamSidebar.jsx',
  'src/components/auth/LoginForm.jsx',
  'src/views/Blogs.jsx',
  'src/components/auth/SignupForm.jsx',
  'src/views/Home.jsx',
  'src/components/Sidebar.jsx',
  'src/components/TopNav.jsx'
];

let totalReplaced = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Use a simpler string replacement in a loop since we know exactly what is there
  // Or a regex that captures everything inside style={{ ... }}
  const regex = /<img\s+src="\/assets\/branding\/logo\.jpg"\s+alt="GermaniStudy Logo"\s+style=\{\{([^}]*)\}\}\s*\/>/g;
  
  const initialContent = content;
  content = content.replace(regex, (match, styleContent) => {
    totalReplaced++;
    return `<img src="/assets/branding/logo_light.png" alt="GermaniStudy Logo" className="logo-light-mode" style={{${styleContent}}} />
          <img src="/assets/branding/logo_dark.png" alt="GermaniStudy Logo" className="logo-dark-mode" style={{${styleContent}}} />`;
  });
  
  if (content !== initialContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${file}`);
  }
});
console.log(`Total replaced: ${totalReplaced}`);
