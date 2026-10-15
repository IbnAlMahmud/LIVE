const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace dark colors with green
  content = content.replace(/bg-charcoal text-white/g, 'bg-fresh-green text-white');
  content = content.replace(/bg-charcoal/g, 'bg-fresh-green');
  content = content.replace(/hover:bg-navy/g, 'hover:bg-elegant-green');
  
  // Fix deep navy if any
  content = content.replace(/bg-deep-navy text-white/g, 'bg-soft-green text-text-main');
  content = content.replace(/bg-deep-navy/g, 'bg-soft-white');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

// Find all tsx files in src/pages/public
const files = ['src/pages/public/Demos.tsx', 'src/pages/public/StartProject.tsx', 'src/pages/public/DemoDetail.tsx'];
files.forEach(fixFile);

console.log('Fixed remaining public pages');
