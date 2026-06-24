const fs = require('fs');
const path = require('path');

const dirPath = "C:\\Users\\loq\\.gemini\\antigravity\\scratch\\hotel-advantage-inn";

function optimizeHtml(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 1. Optimize FontAwesome loading
    const faRegex = /<link\s+rel="stylesheet"\s+href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css"[^>]*>/i;
    const faReplacement = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media=\'all\'">';
    
    if (faRegex.test(content)) {
      content = content.replace(faRegex, faReplacement);
      console.log(`Optimized FontAwesome in: ${path.basename(filePath)}`);
    }

    // 2. Optimize Google Fonts loading
    const fontsRegex = /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+"[^>]*rel="stylesheet"[^>]*>/i;
    const fontsRegexAlt = /<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=[^"]+"[^>]*>/i;
    
    const fontsReplacer = (match) => {
      if (match.includes('media="print"')) return match; // already optimized
      return match.replace('>', ' media="print" onload="this.media=\'all\'">');
    };

    if (fontsRegex.test(content)) {
      content = content.replace(fontsRegex, fontsReplacer);
      console.log(`Optimized Google Fonts (type A) in: ${path.basename(filePath)}`);
    } else if (fontsRegexAlt.test(content)) {
      content = content.replace(fontsRegexAlt, fontsReplacer);
      console.log(`Optimized Google Fonts (type B) in: ${path.basename(filePath)}`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (err) {
    console.error(`Error optimizing ${filePath}:`, err);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.html')) {
      optimizeHtml(fullPath);
    }
  }
}

scanDir(dirPath);
console.log("All HTML files optimized for asynchronous rendering!");
