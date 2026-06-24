const fs = require('fs');
const path = require('path');

const dirPath = "C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn";
const patterns = [
  /wa\.me\/\d+/,
  /tel:[\d\-\+]+/,
  /\b\d{10}\b/,
  /\d{5}\s*\d{5}/,
  /\+91/
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          for (const pattern of patterns) {
            if (pattern.test(line)) {
              console.log(`${file}:${idx + 1}: ${line.trim()}`);
              break;
            }
          }
        });
      } catch (err) {}
    }
  }
}

scanDir(dirPath);
