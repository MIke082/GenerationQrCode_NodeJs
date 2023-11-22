const QRCode = require('qrcode');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateQRCode(url, filename) {
  QRCode.toFile(filename, url, (err) => {
    if (err) {
      console.error('Error creating QR Code:', err);
    } else {
      console.log(`QR Code for ${url} created and saved as ${filename}`);
    }
    rl.close();
  });
}

rl.question('Enter the URL for the QR Code: ', (url) => {
  rl.question('Enter the filename to save the QR Code as (e.g., ./qrcode.png): ', (filename) => {
    // Если имя файла не введено, используйте значение по умолчанию с частью URL
    if (!filename) {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      filename = `./qrcode_${domain}.png`;
      console.log(`Filename not provided. Using default filename: ${filename}`);
    }
    generateQRCode(url, filename);
  });
});
