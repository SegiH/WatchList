// writeBuildDate.js
const fs = require('fs');
const path = require('path');

const buildDate = new Date().toISOString();
const outputPath = path.join(__dirname, 'public', 'build-info.json');

fs.writeFileSync(outputPath, JSON.stringify({ buildDate }, null, 2));
