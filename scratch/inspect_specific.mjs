import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

const cargo = products.find(p => p.id === 'd185af61-5e32-4919-ab3e-cec023486c80');
const tshirt = products.find(p => p.id === '16264b1d-84e0-4982-a3ee-b6bff6b0b668');
const dieovale = products.find(p => p.id === 'c1d52965-8f2c-4de0-ba87-222170b5117f');

console.log('CARGO:', JSON.stringify(cargo, null, 2));
console.log('TSHIRT:', JSON.stringify(tshirt, null, 2));
console.log('DIEOVALE:', JSON.stringify(dieovale, null, 2));
