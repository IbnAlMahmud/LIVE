const fs = require('fs');
let file = 'src/pages/public/DemoDetail.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-modern-blue/g, 'text-fresh-green');
  content = content.replace(/bg-modern-blue/g, 'bg-fresh-green');
  content = content.replace(/bg-gray-50/g, 'bg-soft-white');
  content = content.replace(/text-charcoal/g, 'text-text-main');
  content = content.replace(/border-gray-200/g, 'border-border-color');
  content = content.replace(/bg-gray-200/g, 'bg-soft-blue'); // Background behind the demo preview
  content = content.replace(/bg-gray-100/g, 'bg-soft-white'); // Viewer chrome
  content = content.replace(/border-gray-300/g, 'border-border-color');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed DemoDetail');
