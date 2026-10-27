import https from 'https';
import fs from 'fs';

const url = "https://rxdxykvpnzwontnmgikb.supabase.co/storage/v1/object/public/product-images/byluj3bbex_1793009129254.webp";
const file = fs.createWriteStream("scratch/black_cargo_pants_2.webp");

https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Downloaded, size:", fs.statSync("scratch/black_cargo_pants_2.webp").size);
  });
});
