const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildCategoryImages() {
  console.log('Starting category image generation...');

  // ========================================================
  // 1. WATCHES CATEGORY IMAGE (from user image 2)
  // ========================================================
  const watchInput = 'C:/Users/Haroon/.gemini/antigravity-ide/brain/76b58217-ae72-43e7-aacd-875b7099c53d/.user_uploaded/media_1792157194947.jpg';
  
  // Create a gold radial glow background SVG (1024x1024)
  const watchGlowSvg = Buffer.from(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="watchGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.18" />
          <stop offset="40%" stop-color="#D4AF37" stop-opacity="0.08" />
          <stop offset="70%" stop-color="#050507" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#050507" stop-opacity="1" />
        </radialGradient>
        <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#050507" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="#050507" />
      <circle cx="512" cy="512" r="480" fill="url(#watchGlow)" />
      <rect width="1024" height="1024" fill="url(#vignette)" />
    </svg>
  `);

  // Process the watch: ensure outer edges fade into pure black/dark luxury
  const watchResized = await sharp(watchInput)
    .resize(920, 920, { fit: 'contain', background: { r: 5, g: 5, b: 7, alpha: 0 } })
    .toBuffer();

  const finalWatch = await sharp(watchGlowSvg)
    .composite([
      { input: watchResized, gravity: 'center', blend: 'over' }
    ])
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
    .jpeg({ quality: 96 })
    .toFile('public/images/category-watch.jpg');

  console.log('Saved public/images/category-watch.jpg');

  // Also save a copy as watch.png for fallback
  await sharp('public/images/category-watch.jpg')
    .png()
    .toFile('public/images/watch.png');
  console.log('Updated public/images/watch.png');

  // ========================================================
  // 2. BOTTOM CATEGORY IMAGE (from user image 1 - model transparent)
  // ========================================================
  const modelCutoutPath = 'public/images/model-transparent.png';

  // Trim transparent edges around the model
  const trimmedModelBuffer = await sharp(modelCutoutPath)
    .trim()
    .toBuffer();

  const trimmedMeta = await sharp(trimmedModelBuffer).metadata();
  console.log('Trimmed model size:', trimmedMeta.width, 'x', trimmedMeta.height);

  // Resize model so it fits nicely inside 1024x1024 with breathing room (height ~ 880)
  const targetHeight = 880;
  const scaledModel = await sharp(trimmedModelBuffer)
    .resize({ height: targetHeight, fit: 'inside' })
    .toBuffer();

  const scaledMeta = await sharp(scaledModel).metadata();

  // Create ambient luxury dark background with gold glow & floor shadow for BOTTOM
  const bottomGlowSvg = Buffer.from(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#141418" />
          <stop offset="50%" stop-color="#09090C" />
          <stop offset="100%" stop-color="#040405" />
        </radialGradient>
        <radialGradient id="goldAmbient" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.22" />
          <stop offset="40%" stop-color="#D4AF37" stop-opacity="0.08" />
          <stop offset="85%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.8" />
          <stop offset="70%" stop-color="#000000" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="vignetteCard" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stop-color="#000000" stop-opacity="0" />
          <stop offset="100%" stop-color="#040405" stop-opacity="0.9" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bgGrad)" />
      <circle cx="512" cy="460" r="450" fill="url(#goldAmbient)" />
      <ellipse cx="512" cy="940" rx="340" ry="60" fill="url(#floorShadow)" />
      <rect width="1024" height="1024" fill="url(#vignetteCard)" />
    </svg>
  `);

  // Place model on top, slightly grounded towards the bottom
  const topOffset = Math.round((1024 - targetHeight) / 2) + 20;

  await sharp(bottomGlowSvg)
    .composite([
      { input: scaledModel, top: topOffset, left: Math.round((1024 - scaledMeta.width) / 2) }
    ])
    .sharpen({ sigma: 1.1, m1: 1.0, m2: 2.0 })
    .jpeg({ quality: 96 })
    .toFile('public/images/category-bottom.jpg');

  console.log('Saved public/images/category-bottom.jpg');

  // Also update bottom.jpg
  await sharp('public/images/category-bottom.jpg')
    .jpeg({ quality: 96 })
    .toFile('public/images/bottom.jpg');
  console.log('Updated public/images/bottom.jpg');

  // ========================================================
  // 3. RESTORE HERO BAGGY PANTS IMAGE
  // ========================================================
  const originalHeroPants = 'C:/Users/Haroon/.gemini/antigravity-ide/brain/dad2ce24-53ff-4333-9f14-bf5d7f53f524/baggy_pants_hero_1792127811085.jpg';
  if (fs.existsSync(originalHeroPants)) {
    fs.copyFileSync(originalHeroPants, 'public/images/hero-baggy-pants.jpg');
    console.log('Restored original public/images/hero-baggy-pants.jpg from session backup');
  } else {
    console.log('Backup not found, using existing hero pants');
  }

  console.log('All category & hero images processed successfully!');
}

buildCategoryImages().catch(console.error);
