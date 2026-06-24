const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\styles.css", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('lazy') || line.toLowerCase().includes('loading')) {
    console.log(`styles.css:${idx + 1}: ${line.trim()}`);
  }
});
