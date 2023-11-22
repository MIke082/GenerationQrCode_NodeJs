const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode-generator');
const fs = require('fs');
// const Jimp = require('jimp');

async function generateQRCodeWithImage(name, lastName, imagePath, filename) {
  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name} ${lastName}\nEND:VCARD`;

  try {
    // Генерируем QR-код
    const qr = QRCode(0, 'M');
    qr.addData(vCardData);
    qr.make();

    // Создаем холст
    const canvas = createCanvas(qr.getModuleCount() * 5, qr.getModuleCount() * 5 + 30); // Увеличиваем высоту для текста

    const context = canvas.getContext('2d');

    // Рисуем QR-код на холсте
    for (let row = 0; row < qr.getModuleCount(); row++) {
      for (let col = 0; col < qr.getModuleCount(); col++) {
        context.fillStyle = qr.isDark(row, col) ? 'black' : 'white';
        context.fillRect(col * 5, row * 5, 5, 5); // Изменяем размеры модулей
      }
    }

    // Загружаем изображение
    const image = await loadImage(imagePath);

    // Рисуем изображение размером 20x20 по центру
    const imageSize = 20;
    const centerX = (canvas.width - imageSize) / 2;
    const centerY = (canvas.height - imageSize - 30) / 2; // Учитываем высоту текста
    context.drawImage(image, centerX, centerY, imageSize, imageSize);

    // Добавляем текст в нижний центр
    context.font = '10px Arial';
    context.textAlign = 'center';
    context.fillText(`${name} ${lastName}`, canvas.width / 2, canvas.height - 10);

    // Сохраняем в файл
    const buffer = canvas.toBuffer();
    fs.writeFileSync(filename, buffer);

    console.log(`QR Code with image and text for ${name} ${lastName} created and saved as ${filename}`);
  } catch (err) {
    console.error('Error creating QR Code:', err);
  }
}

// Здесь передаются значения для name, lastName, пути к изображению и filename
generateQRCodeWithImage('John', 'Doe', './images/1.png', 'qrcode_with_image.png');
