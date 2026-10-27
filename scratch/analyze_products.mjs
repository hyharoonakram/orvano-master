import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

const catCounts = {};
for (const p of products) {
  catCounts[p.category] = (catCounts[p.category] || 0) + 1;
}

console.log('Categories count:', catCounts);
console.log('\n--- ALL PRODUCTS ---');
products.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] [Category: "${p.category}"] ${p.name}`);
});
