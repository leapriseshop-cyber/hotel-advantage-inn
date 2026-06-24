const fs = require('fs');
const path = require('path');

const dirPath = "C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn";

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('wa.me') || line.includes('tel:')) {
            console.log(`${file}:${idx + 1}: ${line.trim()}`);
          }
        });
      } catch (err) {}
    }
  }
}

scanDir(dirPath);
