const fs = require('fs');
let file = 'src/pages/public/Home.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-soft-green/g, 'text-fresh-green/20');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed watermark');
