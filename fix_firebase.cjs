const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf8');

// Replace getFirestore with initializeFirestore
content = content.replace("import { getFirestore } from 'firebase/firestore';", "import { initializeFirestore } from 'firebase/firestore';");

// Replace getFirestore(app, "...") with initializeFirestore(app, { experimentalForceLongPolling: true }, "...")
content = content.replace('export const db = getFirestore(app, "ai-studio-9fd7fc44-9ba5-43e6-bedc-da038a916a06");', 'export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-9fd7fc44-9ba5-43e6-bedc-da038a916a06");');

fs.writeFileSync('src/lib/firebase.ts', content, 'utf8');
console.log('Firebase initialized with long polling');
