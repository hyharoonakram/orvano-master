import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

console.log('--- WOMEN\'S WATCHES ---');
products.filter(p => p.category === "Women's Watches").forEach(p => {
  console.log(`[${p.id}] ${p.name}`);
});

console.log('\n--- WATCHES (Generic) ---');
products.filter(p => p.category === "Watches").forEach(p => {
  console.log(`[${p.id}] ${p.name}`);
});

console.log('\n--- MEN\'S WATCHES ---');
products.filter(p => p.category === "Men's Watches").forEach(p => {
  console.log(`[${p.id}] ${p.name}`);
});
