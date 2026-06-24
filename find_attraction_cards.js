const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\index.html", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('class="attraction-card')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
