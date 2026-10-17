const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function main() {
  const input = "C:\\Users\\Haroon\\.gemini\\antigravity-ide\\brain\\de4c5ecc-4f80-49ed-950d-a25f68cbc9d7\\.user_uploaded\\media_1792074664643.jpg";
  const output = path.join(__dirname, "..", "public", "images", "orvano-monogram.png");

  // Read raw pixels
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make near-black transparent
  // Channels: R, G, B, A
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // If pixel is very dark (black background)
    const brightness = (r + g + b) / 3;
    if (brightness < 20) {
      data[i + 3] = 0; // completely transparent
    } else if (brightness < 45) {
      // smooth alpha transition for edges
      data[i + 3] = Math.round(((brightness - 20) / 25) * 255);
    }
  }

  // Trim transparent borders to have tight bounding box
  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .trim()
    .png()
    .toFile(output);

  console.log("Successfully created transparent orvano-monogram.png at", output);
}

main().catch(console.error);
