const fs = require('fs');
const files = [
  'src/pages/public/About.tsx',
  'src/pages/public/Contact.tsx',
  'src/pages/public/Solutions.tsx',
  'src/pages/public/Demos.tsx',
  'src/pages/public/StartProject.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix shadow and hover colors in buttons
    content = content.replace(/shadow-blue-900\/50/g, 'shadow-fresh-green/20');
    content = content.replace(/shadow-blue-900\/20/g, 'shadow-fresh-green/20');
    content = content.replace(/hover:bg-blue-600/g, 'hover:bg-elegant-green');
    content = content.replace(/text-text-main hover:bg-blue-600/g, 'text-white hover:bg-elegant-green');
    content = content.replace(/bg-modern-blue/g, 'bg-fresh-green');
    content = content.replace(/hover:bg-deep-blue/g, 'hover:bg-elegant-green');
    content = content.replace(/text-modern-blue/g, 'text-fresh-green');
    
    // Fix black overlay
    content = content.replace(/bg-black\/40/g, 'bg-text-main/10 backdrop-blur-sm');

    // Make sure buttons with fresh-green have text-white not text-text-main
    content = content.replace(/bg-fresh-green text-white[^>]*text-text-main/g, match => match.replace('text-text-main', ''));

    // Additional generic fixes
    content = content.replace(/bg-blue-50/g, 'bg-soft-green');
    content = content.replace(/border-modern-blue/g, 'border-fresh-green');

    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Fixed artifacts');
