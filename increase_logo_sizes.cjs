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
  
  // Find height: '48px' etc and increase by 50%
  const regex = /height:\s*'(\d+)px'/g;
  
  const initialContent = content;
  content = content.replace(regex, (match, heightStr) => {
    // Only increase if it looks like a logo height (e.g. we know we have 32, 40, 48, 64, 120)
    const h = parseInt(heightStr, 10);
    if ([32, 40, 48, 64, 120].includes(h)) {
      totalReplaced++;
      const newHeight = Math.round(h * 1.5);
      return `height: '${newHeight}px'`;
    }
    return match;
  });
  
  if (content !== initialContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated sizes in ${file}`);
  }
});
console.log(`Total replaced: ${totalReplaced}`);
