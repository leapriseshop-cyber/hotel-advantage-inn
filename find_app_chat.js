const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\app.js", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('chat') || line.toLowerCase().includes('bot') || line.toLowerCase().includes('faq')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
