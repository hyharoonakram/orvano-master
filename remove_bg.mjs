import { Jimp } from "jimp";
import path from "path";
import fs from "fs";

const THRESHOLD = 15;

async function processImage(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    console.log(`Processing ${inputPath}...`);
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If near black, make it transparent
      if (red <= THRESHOLD && green <= THRESHOLD && blue <= THRESHOLD) {
        this.bitmap.data[idx + 3] = 0; // alpha
      }
    });

    await image.write(outputPath);
    console.log(`Saved to ${outputPath}`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function main() {
  const watchInput = "C:\\Users\\premier\\.gemini\\antigravity-ide\\brain\\141ddfd8-e665-4fd4-b1c2-95d47bc0bf0f\\luxury_watch_1781361749507.png";
  const pantsInput = "C:\\Users\\premier\\.gemini\\antigravity-ide\\brain\\141ddfd8-e665-4fd4-b1c2-95d47bc0bf0f\\baggy_pants_1781361764452.png";
  
  const publicDir = "e:\\orvano\\public\\images";
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await processImage(watchInput, path.join(publicDir, "watch.png"));
  await processImage(pantsInput, path.join(publicDir, "pants.png"));
}

main();
