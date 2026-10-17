const sharp = require('sharp');

async function createSeamlessFramed() {
  const meta = await sharp('public/images/hero-user-baggy-model.jpg').metadata();
  const width = meta.width;
  const height = meta.height;
  const extraTop = 240;
  const newHeight = height + extraTop;

  const svgOverlay = Buffer.from(
    '<svg width="' + width + '" height="' + newHeight + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="black" stop-opacity="1" />' +
          '<stop offset="15%" stop-color="black" stop-opacity="1" />' +
          '<stop offset="26%" stop-color="black" stop-opacity="0.8" />' +
          '<stop offset="35%" stop-color="black" stop-opacity="0" />' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="' + width + '" height="' + newHeight + '" fill="url(#fade)" />' +
    '</svg>'
  );

  const extended = await sharp('public/images/hero-user-baggy-model.jpg')
    .extend({
      top: extraTop,
      bottom: 0,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0 }
    })
    .toBuffer();

  await sharp(extended)
    .composite([{ input: svgOverlay, blend: 'over' }])
    .jpeg({ quality: 96 })
    .toFile('public/images/hero-user-baggy-model-framed.jpg');

  console.log('Seamless blend generated successfully!');
}

createSeamlessFramed().catch(console.error);
