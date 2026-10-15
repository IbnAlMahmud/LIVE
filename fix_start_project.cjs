const fs = require('fs');
let file = 'src/pages/public/StartProject.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-charcoal/g, 'text-text-main');
  content = content.replace(/text-gray-600/g, 'text-text-muted');
  content = content.replace(/border-gray-200/g, 'border-border-color');
  content = content.replace(/border-gray-100/g, 'border-border-color');
  content = content.replace(/ring-modern-blue/g, 'ring-fresh-green');
  content = content.replace(/text-gray-500/g, 'text-text-muted');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed StartProject');
