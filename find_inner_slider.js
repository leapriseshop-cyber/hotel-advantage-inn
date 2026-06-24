const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\app.js", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('inner-slider') || line.includes('inner-nav') || line.includes('slide-index') || line.includes('currentImageIndex')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
