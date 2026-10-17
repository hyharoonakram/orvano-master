const sharp = require('sharp');
const fs = require('fs');

async function createHeroModel() {
  const modelCutout = 'public/images/model-transparent.png';
  
  // Trim transparent padding
  const trimmed = await sharp(modelCutout).trim().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  console.log('Trimmed size:', trimmedMeta.width, 'x', trimmedMeta.height);
  
  // Target canvas: 896 x 1200 (exact match to hero-watches.jpg)
  const canvasW = 896;
  const canvasH = 1200;
  
  // Scale model so it is prominently displayed in the upper-middle of hero (width ~ 540)
  const targetW = 540;
  const scaled = await sharp(trimmed)
    .resize({ width: targetW, fit: 'inside' })
    .toBuffer();
  const scaledMeta = await sharp(scaled).metadata();
  
  const leftPos = Math.round((canvasW - scaledMeta.width) / 2);
  const topPos = Math.round(canvasH * 0.16); // 16% from top so head is clearly visible below navbar
  
  // Background SVG with ambient gold glow and bottom shadow for text legibility
  const haloY = Math.round(topPos + scaledMeta.height * 0.42);
  const floorY = Math.round(topPos + scaledMeta.height + 10);
  
  const bgSvg = Buffer.from(
    '<svg width="' + canvasW + '" height="' + canvasH + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
        '<radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">' +
          '<stop offset="0%" stop-color="#15151c" />' +
          '<stop offset="45%" stop-color="#08080b" />' +
          '<stop offset="100%" stop-color="#020203" />' +
        '</radialGradient>' +
        '<radialGradient id="goldHalo" cx="50%" cy="40%" r="42%">' +
          '<stop offset="0%" stop-color="#D4AF37" stop-opacity="0.24" />' +
          '<stop offset="35%" stop-color="#D4AF37" stop-opacity="0.10" />' +
          '<stop offset="75%" stop-color="#000000" stop-opacity="0" />' +
        '</radialGradient>' +
        '<radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%" stop-color="#000000" stop-opacity="0.95" />' +
          '<stop offset="60%" stop-color="#000000" stop-opacity="0.4" />' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="0" />' +
        '</radialGradient>' +
        '<linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#000000" stop-opacity="0" />' +
          '<stop offset="65%" stop-color="#000000" stop-opacity="0.75" />' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="1" />' +
        '</linearGradient>' +
        '<linearGradient id="topFade" x1="0" y1="1" x2="0" y2="0">' +
          '<stop offset="0%" stop-color="#000000" stop-opacity="0" />' +
          '<stop offset="80%" stop-color="#000000" stop-opacity="0.6" />' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="0.95" />' +
        '</linearGradient>' +
      '</defs>' +
      '<rect width="' + canvasW + '" height="' + canvasH + '" fill="url(#bgGrad)" />' +
      '<circle cx="' + (canvasW / 2) + '" cy="' + haloY + '" r="380" fill="url(#goldHalo)" />' +
      '<ellipse cx="' + (canvasW / 2) + '" cy="' + floorY + '" rx="260" ry="40" fill="url(#floorShadow)" />' +
      '<rect width="' + canvasW + '" height="' + canvasH + '" fill="url(#bottomFade)" />' +
      '<rect width="' + canvasW + '" height="200" fill="url(#topFade)" />' +
    '</svg>'
  );
  
  await sharp(bgSvg)
    .composite([
      { input: scaled, top: topPos, left: leftPos }
    ])
    .sharpen({ sigma: 1.1, m1: 1.0, m2: 2.0 })
    .jpeg({ quality: 96 })
    .toFile('public/images/hero-user-baggy-model-dark.jpg');
    
  console.log('Saved public/images/hero-user-baggy-model-dark.jpg successfully!');
}

createHeroModel().catch(console.error);
