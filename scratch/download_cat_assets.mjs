import https from 'https';
import fs from 'fs';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${dest}, size:`, fs.statSync(dest).size);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  await download(
    'https://rxdxykvpnzwontnmgikb.supabase.co/storage/v1/object/public/product-images/o90v2mkje3_1793088994098.webp',
    'public/images/category-womens-watches.webp'
  );
  await download(
    'https://rxdxykvpnzwontnmgikb.supabase.co/storage/v1/object/public/product-images/8eds0at7br_1793006553837.webp',
    'public/images/category-womens-clothing.webp'
  );
  console.log('Category card assets downloaded successfully!');
}

main();
