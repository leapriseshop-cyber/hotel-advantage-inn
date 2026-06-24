const https = require('https');

const files = [
  'Allahabad_high_court.jpg',
  'Lete_Hanuman_Ji_Mandir.jpg',
  'Khusro_Bagh.jpg',
  'Azad_statue.JPG',
  'SWARAJ_BHAWAN.JPG'
];

function followRedirect(url, filename) {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      followRedirect(res.headers.location, filename);
    } else {
      console.log(`${filename} FINAL -> ${url}`);
    }
  }).on('error', (err) => {
    console.error(err);
  });
}

files.forEach(file => {
  const startUrl = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${file}`;
  followRedirect(startUrl, file);
});
