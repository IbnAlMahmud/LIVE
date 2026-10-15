const fs = require('fs');
const path = require('path');

const pages = [
  'Analytics', 'Notifications', 'Media', 'Blog', 'FAQ', 'Testimonials',
  'Pricing', 'Services', 'Homepage', 'Navigation', 'SEO', 'Pixel', 'System'
];

const dir = path.join(__dirname, 'src/pages/admin');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

pages.forEach(page => {
  const file = path.join(dir, `${page}.tsx`);
  if (!fs.existsSync(file)) {
    const content = `import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function ${page}() {
  return (
    <>
      <Helmet>
        <title>${page} | AureviaWeb Admin</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">${page}</h1>
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          Module under construction.
        </div>
      </div>
    </>
  );
}
`;
    fs.writeFileSync(file, content);
  }
});
console.log('Scaffold complete');
