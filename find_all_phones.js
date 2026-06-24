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
    } else if (file.endsWith('.html')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('94152') || line.includes('72679') || line.includes('63940') || line.includes('80817') || line.includes('tel:') || line.includes('wa.me')) {
            console.log(`${file}:${idx + 1}: ${line.strip ? line.strip() : line.trim()}`);
          }
        });
      } catch (err) {}
    }
  }
}

scanDir(dirPath);
