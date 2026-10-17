const sharp = require('sharp');
const fs = require('fs');

async function processHeroImage() {
  const input = 'C:/Users/Haroon/.gemini/antigravity-ide/brain/76b58217-ae72-43e7-aacd-875b7099c53d/hero_baggy_model_hd_1792209226233.jpg';
  
  const meta = await sharp(input).metadata();
  console.log('Input size:', meta.width, 'x', meta.height);
  
  // Upscale to high-definition 2K (1536 x 2048) with lanczos3
  // Add 160px dark extension at bottom so boots sit comfortably inside the viewport
  // and are never clipped by the edge of screen
  const upscaled = await sharp(input)
    .resize(1536, 2048, { kernel: 'lanczos3' })
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.5 })
    .toBuffer();
    
  // Add a subtle bottom extension with dark floor gradient so boots have ample space
  const finalImage = await sharp(upscaled)
    .extend({
      top: 60,
      bottom: 180,
      left: 0,
      right: 0,
      background: { r: 5, g: 5, b: 7 }
    })
    .jpeg({ quality: 98, chromaSubsampling: '4:4:4' })
    .toFile('public/images/hero-baggy-pants-v3.jpg');

  console.log('Saved public/images/hero-baggy-pants-v3.jpg');
}

processHeroImage().catch(console.error);
