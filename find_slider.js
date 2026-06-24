const fs = require('fs');

const cssContent = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\styles.css", 'utf-8');
const cssLines = cssContent.split('\n');
cssLines.forEach((line, idx) => {
  if (line.includes('room-slider') || line.includes('room-slide') || line.includes('slider-track')) {
    console.log(`styles.css:${idx + 1}: ${line.trim()}`);
  }
});

const htmlContent = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\index.html", 'utf-8');
const htmlLines = htmlContent.split('\n');
htmlLines.forEach((line, idx) => {
  if (line.includes('room-slider') || line.includes('room-slide') || line.includes('slider-track')) {
    console.log(`index.html:${idx + 1}: ${line.trim()}`);
  }
});
