import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scratch/all_products.json', 'utf8'));

// Classification function
function getNormalizedCategory(p) {
  const cat = (p.category || "").trim();
  const name = (p.name || "").trim().toLowerCase();
  const id = p.id;

  // Women's Watches
  if (
    cat === "Women's Watches" ||
    name.includes("women's watch") ||
    name.includes("for women") ||
    name.includes("rose gold pink crystal bracelet watch") ||
    name.includes("moonston") ||
    name.includes("casal rose gold") ||
    name.includes("midnight luxe crystal digital watch") ||
    name.includes("newsotime pearl") ||
    name.includes("true worth rose gold") ||
    name.includes("true worth luxury two-tone") ||
    name.includes("tac watch luxury gold square dial")
  ) {
    return "Women's Watches";
  }

  // Men's Watches
  if (
    cat === "Men's Watches" ||
    cat === "Watches" ||
    id === 'c1d52965-8f2c-4de0-ba87-222170b5117f' || // Dieovale
    name.includes("watch") ||
    name.includes("chronograph") ||
    name.includes("tourbillon") ||
    name.includes("rolex") ||
    name.includes("patek") ||
    name.includes("hublot") ||
    name.includes("rado") ||
    name.includes("citizen") ||
    name.includes("seiko") ||
    name.includes("lamborghini carbon phantom") ||
    name.includes("emerald crystal prestige")
  ) {
    return "Men's Watches";
  }

  // Women's Clothing (all women's baggy pants and other clothing products)
  if (
    cat === "Women's Baggy" ||
    cat === "Women's Clothing" ||
    name.includes("women's") ||
    name.includes("women") ||
    cat === "T-Shirts" ||
    id === '16264b1d-84e0-4982-a3ee-b6bff6b0b668' // CUSTOMIZE T-Shirt
  ) {
    return "Women's Clothing";
  }

  // Men's Baggy Jeans (show only jeans)
  if (
    cat === "Pants" ||
    cat === "Men's Baggy" ||
    cat === "Men's Baggy Jeans" ||
    name.includes("jean") ||
    name.includes("baggy") ||
    name.includes("relaxed") ||
    name.includes("wide-leg")
  ) {
    return "Men's Baggy Jeans";
  }

  return "Other";
}

const categorized = {
  "Women's Watches": [],
  "Men's Watches": [],
  "Women's Clothing": [],
  "Men's Baggy Jeans": [],
  "Other": []
};

for (const p of products) {
  const c = getNormalizedCategory(p);
  categorized[c].push(p);
}

console.log("=== CATEGORIZATION RESULTS ===");
for (const [cat, list] of Object.entries(categorized)) {
  console.log(`\n--- ${cat}: ${list.length} products ---`);
  list.forEach(p => console.log(`  - ${p.name}`));
}
