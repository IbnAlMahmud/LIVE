const fs = require('fs');
const path = require('path');
const pages = ['About.tsx', 'Contact.tsx', 'Process.tsx', 'Solutions.tsx', 'Insights.tsx', 'FAQPublic.tsx', 'Legal.tsx'];

pages.forEach(file => {
  const p = path.join(process.cwd(), 'src', 'pages', 'public', file);
  if(!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  // High-level blocks
  content = content.replace(/bg-charcoal text-white/g, 'bg-soft-green text-text-main');
  content = content.replace(/bg-charcoal/g, 'bg-soft-green text-text-main');
  content = content.replace(/bg-deep-navy text-white/g, 'bg-soft-green text-text-main');
  content = content.replace(/bg-deep-navy/g, 'bg-soft-white text-text-main');
  
  // Specific text overrides that might have been lost
  content = content.replace(/text-white/g, 'text-text-main');
  content = content.replace(/text-gray-600/g, 'text-text-muted font-medium');
  content = content.replace(/text-gray-500/g, 'text-text-muted font-medium');
  content = content.replace(/text-gray-400/g, 'text-text-muted font-medium');
  content = content.replace(/text-gray-300/g, 'text-text-muted font-medium');
  
  // Brand color overrides
  content = content.replace(/bg-modern-blue/g, 'bg-fresh-green text-white');
  content = content.replace(/text-modern-blue/g, 'text-elegant-green');
  
  // Fix nested button styles that were aggressively overwritten by text-white -> text-text-main
  content = content.replace(/bg-fresh-green text-text-main/g, 'bg-fresh-green text-white');
  
  fs.writeFileSync(p, content, 'utf8');
});
