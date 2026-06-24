const fs = require('fs');

const cssContent = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\styles.css", 'utf-8');
const cssLines = cssContent.split('\n');
cssLines.forEach((line, idx) => {
  if (line.includes('hero-section') || line.includes('hero-slide') || line.includes('slide-image') || line.includes('slide-copy-card') || line.includes('hero-nav')) {
    console.log(`styles.css:${idx + 1}: ${line.trim()}`);
  }
});
