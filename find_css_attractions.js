const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\styles.css", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('attraction-grid') || line.includes('attraction-card') || line.includes('attraction-overlay')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
