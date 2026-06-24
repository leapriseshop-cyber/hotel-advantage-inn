const fs = require('fs');
const content = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\index.html", 'utf-8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('<section') || line.includes('class="section') || line.includes('id="amenities"') || line.includes('id="attractions"')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
