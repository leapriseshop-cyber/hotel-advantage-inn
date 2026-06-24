const fs = require('fs');

const cssContent = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\styles.css", 'utf-8');
const cssLines = cssContent.split('\n');
cssLines.forEach((line, idx) => {
  if (line.includes('reviews-grid') || line.includes('review-card') || line.includes('review-profile') || line.includes('review-avatar')) {
    console.log(`styles.css:${idx + 1}: ${line.trim()}`);
  }
});
