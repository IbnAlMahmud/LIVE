const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newRoutes = `
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/process" element={<Process />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/faq" element={<FAQPublic />} />
            <Route path="/privacy" element={<Legal page="privacy" />} />
            <Route path="/terms" element={<Legal page="terms" />} />
`;

code = code.replace(/<Route path="\/start-project" element={<StartProject \/>} \/>/g, `<Route path="/start-project" element={<StartProject />} />\n${newRoutes}`);

fs.writeFileSync('src/App.tsx', code);
