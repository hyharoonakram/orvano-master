import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

console.log('=== PRODUCT DETAILS BY CURRENT CATEGORY ===\n');

const byCat = {};
for (const p of products) {
  if (!byCat[p.category]) byCat[p.category] = [];
  byCat[p.category].push(p);
}

for (const [cat, list] of Object.entries(byCat)) {
  console.log(`\n================= CATEGORY: ${cat} (${list.length}) =================`);
  for (const p of list) {
    console.log(`ID: ${p.id}`);
    console.log(`  Name: ${p.name}`);
    console.log(`  Price: $${p.price}`);
    console.log(`  Image: ${p.image_url}`);
    console.log(`  Desc: ${p.description?.slice(0, 100)}...`);
  }
}
