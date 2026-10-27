import https from 'https';
import fs from 'fs';

const url = "https://rxdxykvpnzwontnmgikb.supabase.co/storage/v1/object/public/product-images/p0epkm5pwi_1793009129029.webp";
const file = fs.createWriteStream("scratch/black_cargo_pants.webp");

https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Downloaded black_cargo_pants.webp, size:", fs.statSync("scratch/black_cargo_pants.webp").size);
  });
});
