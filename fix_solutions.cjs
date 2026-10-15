const fs = require('fs');

let content = fs.readFileSync('src/components/ui/PremiumSolutions.tsx', 'utf8');

// Add more solutions to the array
const newSolutions = `
  {
    id: 'technology',
    title: 'Technology & SaaS',
    desc: 'High-performance landing pages for modern tech products. We highlight your software features with clean interfaces, dynamic product demos, and strong conversion funnels.',
    icon: Building2,
    features: ['Feature Highlights', 'Interactive Demos', 'Conversion Funnels'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'bg-soft-blue',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-500',
    reverse: true,
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 20 50 L 50 20 L 80 50 L 50 80 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="5" fill="currentColor" />
        </pattern>
        <rect x="0" y="0" w="100%" h="100%" fill="url(#tech-pattern)" />
      </svg>
    )
  }
];
`;

content = content.replace('];\n\nexport function PremiumSolutions', newSolutions + '\nexport function PremiumSolutions');

fs.writeFileSync('src/components/ui/PremiumSolutions.tsx', content, 'utf8');
console.log('Solutions updated');
