export const STORE_CATEGORIES = [
  "All",
  "Men's Watches",
  "Women's Watches",
  "Women's Baggy",
  "Men's Baggy",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "/images/watch.png";
  return url.trim();
}

export function isWatchProduct(p: any): boolean {
  if (!p) return false;
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return (
    cat.includes("watch") ||
    name.includes("watch") ||
    name.includes("chronograph") ||
    name.includes("tourbillon") ||
    name.includes("rolex") ||
    name.includes("patek") ||
    name.includes("hublot") ||
    name.includes("rado") ||
    name.includes("citizen") ||
    name.includes("seiko") ||
    p.id === "c1d52965-8f2c-4de0-ba87-222170b5117f" // Dieovale Celestial Automatic Watch
  );
}

export function isPantProduct(p: any): boolean {
  if (!p) return false;
  if (isWatchProduct(p)) return false;
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return (
    cat.includes("pant") ||
    cat.includes("baggy") ||
    cat.includes("trouser") ||
    cat.includes("cargo") ||
    name.includes("jean") ||
    name.includes("pant") ||
    name.includes("baggy") ||
    name.includes("cargo") ||
    name.includes("wide-leg") ||
    name.includes("relaxed")
  );
}

export function isWomenProduct(p: any): boolean {
  if (!p) return false;
  const cat = (p.category || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  return (
    cat.includes("women") ||
    name.includes("women") ||
    name.includes("ladies") ||
    name.includes("female") ||
    name.includes("moonston") ||
    name.includes("casal") ||
    name.includes("mira rose") ||
    name.includes("true worth") ||
    name.includes("newsotime") ||
    name.includes("tac watch") ||
    name.includes("midnight luxe")
  );
}

/**
 * Normalizes all product fields (category, name, description, images)
 * to guarantee strict separation between watches and baggy pants.
 */
export function normalizeProductData(product: any): any {
  if (!product) return product;

  const id = product.id || "";
  let name = (product.name || "").trim();
  let description = product.description || "";
  const rawCat = (product.category || "").trim();

  // Clean up known typos and punctuation in names
  if (name.startsWith(" ORVANO")) {
    name = name.trim();
  }
  if (name.endsWith(".")) {
    name = name.slice(0, -1).trim();
  }
  if (name === "Rolex Oyster perpetual") {
    name = "Rolex Oyster Perpetual";
  }
  if (id === "3bd470c8-f936-42f8-bfb0-9b580f60a3cc" || name.toLowerCase().includes("light blue")) {
    name = "ORVANO Women's Washed Light Blue Wide-Leg Jeans";
  }

  // Definitively resolve category
  let category = rawCat;

  if (isWatchProduct({ ...product, name })) {
    category = isWomenProduct({ ...product, name }) ? "Women's Watches" : "Men's Watches";
  } else if (isPantProduct({ ...product, name })) {
    category = isWomenProduct({ ...product, name }) ? "Women's Baggy" : "Men's Baggy";
  } else if (id === "16264b1d-84e0-4982-a3ee-b6bff6b0b668") {
    category = "T-Shirts";
  }

  // Description copy accuracy
  if (id === "3bd470c8-f936-42f8-bfb0-9b580f60a3cc") {
    description = description.replace(/Washed Grey/gi, "Light Blue");
    if (!description.includes("Light Blue")) {
      description = `## ORVANO Women's Washed Light Blue Wide-Leg Jeans\n\n**Product Description**\n\nDiscover effortless style with ORVANO Women's Washed Light Blue Wide-Leg Jeans. Designed with a contemporary high-rise silhouette and relaxed wide-leg drape, these jeans blend comfort with elevated streetwear aesthetics.\n\n**Key Features**\n- **Color:** Washed Light Blue\n- **Fit:** High-Rise Relaxed Wide-Leg\n- **Fabric:** Premium Cotton Denim\n- **Style:** Timeless, versatile streetwear\n\n**ORVANO — Style That Speaks.**`;
    }
  }

  // Images normalization
  const image_url = normalizeImageUrl(product.image_url);
  let imgs: string[] = [];
  if (Array.isArray(product.images)) {
    imgs = product.images.map((img: string) => normalizeImageUrl(img));
  } else if (typeof product.images === "string") {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) imgs = parsed.map((img: string) => normalizeImageUrl(img));
      else imgs = [normalizeImageUrl(product.images)];
    } catch {
      imgs = [normalizeImageUrl(product.images)];
    }
  } else {
    imgs = [image_url];
  }

  return {
    ...product,
    name,
    category,
    description,
    image_url,
    images: imgs.length > 0 ? imgs : [image_url],
  };
}

/**
 * Filter products cleanly based on category selection.
 * Strict separation:
 * - Women's Watches: ONLY women's watches, NEVER baggy pants.
 * - Women's Baggy: ONLY women's baggy pants/jeans, NEVER watches.
 * - Men's Watches: ONLY men's watches, NEVER baggy pants.
 * - Men's Baggy: ONLY men's baggy pants/jeans, NEVER watches.
 * - Watches: All watches (men's & women's), NEVER baggy pants.
 * - Bottom / Pants: All baggy pants (men's & women's), NEVER watches.
 */
export function isProductInCategory(product: any, categoryName: string): boolean {
  if (!categoryName || categoryName === "All") return true;

  const norm = normalizeProductData(product);
  const activeCat = categoryName.trim().toLowerCase();

  const watch = isWatchProduct(norm);
  const pant = isPantProduct(norm);
  const women = isWomenProduct(norm);

  // 1. Women's Watches: ONLY women's watches, NEVER baggy pants
  if (activeCat === "women's watches" || activeCat === "womens watches") {
    return watch && women && !pant;
  }

  // 2. Men's Watches: ONLY men's watches, NEVER baggy pants
  if (activeCat === "men's watches" || activeCat === "mens watches") {
    return watch && !women && !pant;
  }

  // 3. Women's Baggy: ONLY women's baggy pants/jeans, NEVER watches
  if (
    activeCat === "women's baggy" ||
    activeCat === "womens baggy" ||
    activeCat === "women baggy" ||
    activeCat === "women's baggy pants" ||
    activeCat === "women's clothing" ||
    activeCat === "womens clothing"
  ) {
    return pant && women && !watch;
  }

  // 4. Men's Baggy: ONLY men's baggy pants/jeans, NEVER watches
  if (
    activeCat === "men's baggy" ||
    activeCat === "mens baggy" ||
    activeCat === "men baggy" ||
    activeCat === "men's baggy pants" ||
    activeCat === "men's baggy jeans" ||
    activeCat === "mens baggy jeans" ||
    activeCat === "baggy jeans" ||
    activeCat === "jeans"
  ) {
    return pant && !women && !watch;
  }

  // 5. Watches (Homepage Box / Collection): ONLY watches, NEVER baggy pants
  if (activeCat === "watches") {
    return watch && !pant;
  }

  // 6. Bottom / Pants (Homepage Box / Collection): ONLY baggy pants, NEVER watches
  if (activeCat === "bottom" || activeCat === "bottoms" || activeCat === "pants") {
    return pant && !watch;
  }

  // 7. Shoes (Homepage Box)
  if (activeCat === "shoes" || activeCat === "shoe") {
    const rawCat = (norm.category || "").toLowerCase();
    const rawName = (norm.name || "").toLowerCase();
    return rawCat.includes("shoe") || rawCat.includes("sneaker") || rawName.includes("shoe") || rawName.includes("sneaker");
  }

  // 8. Top (Homepage Box) / T-Shirts
  if (activeCat === "top" || activeCat === "tops" || activeCat === "t-shirts" || activeCat === "hoodies") {
    const rawCat = (norm.category || "").toLowerCase();
    const rawName = (norm.name || "").toLowerCase();
    return (
      norm.id === "16264b1d-84e0-4982-a3ee-b6bff6b0b668" ||
      rawCat.includes("shirt") ||
      rawCat.includes("tee") ||
      rawCat.includes("hoodie") ||
      rawCat.includes("top") ||
      rawName.includes("shirt") ||
      rawName.includes("tee")
    );
  }

  return false;
}
