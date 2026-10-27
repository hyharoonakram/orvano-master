import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

console.log('=== FULL AUDIT OF ALL 64 PRODUCTS ===');
for (const p of products) {
  const issues = [];
  
  // Check image
  if (!p.image_url || p.image_url.includes('undefined')) {
    issues.push('Missing/invalid image_url');
  }
  
  // Check category
  if (!p.category) {
    issues.push('Missing category');
  }

  // Check name typos or inconsistencies
  if (p.name.includes('light blue')) {
    issues.push('Lowercase "light blue" in name');
  }
  if (p.name.includes('Rolex Oyster perpetual')) {
    issues.push('Lowercase "perpetual" in Rolex Oyster perpetual');
  }
  if (p.name.startsWith(' ORVANO')) {
    issues.push('Leading space in name');
  }
  if (p.name.endsWith('.')) {
    issues.push('Trailing period in name');
  }

  // Check description vs name
  if (p.name.toLowerCase().includes('light blue') && p.description.toLowerCase().includes('washed grey')) {
    issues.push('Description mentions "Washed Grey" for Light Blue Jeans');
  }
  if (p.name.includes('Dark Indigo Baggy Jeans') && p.description.includes('Dark Blue Baggy Cargo Jeans')) {
    issues.push('Description mentions "Cargo Jeans" for Dark Indigo Baggy Jeans');
  }

  console.log(`[${p.id}] "${p.name}" | Cat: "${p.category}" | Issues: ${issues.length > 0 ? issues.join(', ') : 'None'}`);
}
