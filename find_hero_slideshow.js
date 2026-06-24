const fs = require('fs');

const appContent = fs.readFileSync("C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn\\app.js", 'utf-8');
const appLines = appContent.split('\n');
appLines.forEach((line, idx) => {
  if (line.includes('hero-slide') || line.includes('heroSlides') || line.includes('showSlide') || line.includes('autoRotate') || line.includes('hero-section')) {
    console.log(`app.js:${idx + 1}: ${line.trim()}`);
  }
});
