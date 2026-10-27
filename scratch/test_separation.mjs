import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

function isWatch(p) {
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return cat.includes("watch") || name.includes("watch") || name.includes("chronograph") || name.includes("tourbillon") || name.includes("rolex") || name.includes("patek") || name.includes("hublot") || name.includes("rado") || name.includes("citizen") || name.includes("seiko") || p.id === 'c1d52965-8f2c-4de0-ba87-222170b5117f';
}

function isPant(p) {
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return !isWatch(p) && (cat.includes("pant") || cat.includes("baggy") || name.includes("jean") || name.includes("pant") || name.includes("baggy") || name.includes("cargo") || name.includes("wide-leg") || name.includes("relaxed"));
}

function isWomen(p) {
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return cat.includes("women") || name.includes("women") || name.includes("ladies") || name.includes("female") || name.includes("moonston") || name.includes("casal") || name.includes("mira rose") || name.includes("true worth") || name.includes("newsotime") || name.includes("tac watch") || name.includes("midnight luxe");
}

function isProductInCategory(p, catName) {
  const c = catName.toLowerCase().trim();
  if (c === "all") return true;

  if (c === "women's watches" || c === "womens watches") {
    return isWatch(p) && isWomen(p);
  }
  if (c === "men's watches" || c === "mens watches") {
    return isWatch(p) && !isWomen(p);
  }
  if (c === "women's baggy" || c === "womens baggy" || c === "women baggy" || c === "women's clothing") {
    return isPant(p) && isWomen(p);
  }
  if (c === "men's baggy" || c === "mens baggy" || c === "men baggy" || c === "men's baggy jeans" || c === "mens baggy jeans") {
    return isPant(p) && !isWomen(p);
  }
  if (c === "watches") {
    return isWatch(p);
  }
  if (c === "bottom" || c === "bottoms" || c === "pants") {
    return isPant(p);
  }
  return false;
}

const testCats = ["Women's Watches", "Women's Baggy", "Men's Watches", "Men's Baggy", "Watches", "Bottom"];

for (const cat of testCats) {
  const matches = products.filter(p => isProductInCategory(p, cat));
  console.log(`\n================== ${cat}: ${matches.length} items ==================`);
  matches.forEach(p => console.log(`  - [${p.category}] ${p.name}`));
}
