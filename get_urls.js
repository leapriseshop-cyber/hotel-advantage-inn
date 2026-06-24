const https = require('https');

const files = [
  'Allahabad_high_court.jpg',
  'Lete_Hanuman_Ji_Mandir.jpg',
  'Khusro_Bagh.jpg',
  'Alfred_Park_Allahabad.jpg',
  'Saraswati_Ghat_Yamuna.jpg'
];

function getRedirect(filename) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  };
  https.get(url, options, (res) => {
    // console.log(res.headers);
    const loc = res.headers.location || res.headers.Location;
    console.log(`${filename} -> ${loc}`);
  }).on('error', (err) => {
    console.error(err);
  });
}

files.forEach(getRedirect);
