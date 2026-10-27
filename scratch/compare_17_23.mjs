import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

const p17 = products.find(p => p.id === 'f77256eb-20fd-44f7-b816-2daabf927517');
const p23 = products.find(p => p.id === 'd185af61-5e32-4919-ab3e-cec023486c80');

console.log('Product 17 (Women):', p17.name, p17.image_url);
console.log('Product 23 (Men):', p23.name, p23.image_url);
