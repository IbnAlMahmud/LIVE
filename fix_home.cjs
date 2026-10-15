const fs = require('fs');

let content = fs.readFileSync('src/pages/public/Home.tsx', 'utf8');

// Add imports
content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { PremiumHero } from '@/components/ui/PremiumHero';\nimport { PremiumSolutions } from '@/components/ui/PremiumSolutions';\nimport { PremiumDemos } from '@/components/ui/PremiumDemos';");

// Use regular expressions to replace the Hero section
// Find SECTION 01 to TOP VISUAL STRIP
const heroRegex = /\{\/\* SECTION 01: WHITE HERO WITH ART-DIRECTED COLLAGE \*\/\}[\s\S]*?\{\/\* TOP VISUAL STRIP \*\/\}[\s\S]*?\{\/\* SECTION 02/m;
content = content.replace(heroRegex, "<PremiumHero projects={featuredWork} />\n\n      {/* SECTION 02");

// Replace SECTION 03 (INTERACTIVE SERVICES) with PremiumSolutions
const servicesRegex = /\{\/\* SECTION 03: INTERACTIVE SERVICES \*\/\}[\s\S]*?\{\/\* SECTION 04/m;
content = content.replace(servicesRegex, "<PremiumSolutions />\n\n      {/* SECTION 04");

// Replace SECTION 04 & 05 (FEATURED WORK / INDUSTRIES) with PremiumDemos
const workRegex = /\{\/\* SECTION 04: FEATURED WORK \*\/\}[\s\S]*?\{\/\* SECTION 06/m;
content = content.replace(workRegex, "<PremiumDemos demos={displayProjects} />\n\n      {/* SECTION 06");

fs.writeFileSync('src/pages/public/Home.tsx', content, 'utf8');
console.log('Home.tsx updated successfully');
