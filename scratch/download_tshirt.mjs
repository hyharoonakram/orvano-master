import https from 'https';
import fs from 'fs';

const url = "https://rxdxykvpnzwontnmgikb.supabase.co/storage/v1/object/public/product-images/bqbq9p0p0s_1793023022661.webp";
const file = fs.createWriteStream("scratch/tshirt.webp");

https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Downloaded tshirt.webp, size:", fs.statSync("scratch/tshirt.webp").size);
  });
});
