import { classifyProduct, isProductMatchingFilter, parseCategoryParam } from "./categories";

export const STORE_CATEGORIES = [
  "All",
  "Men's Watches",
  "Women's Watches",
  "Women's Baggy",
  "Men's Baggy",
  "Top",
  "Shoes",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string" || url.trim() === "") return "/images/watch.png";
  return url.trim();
}

export function isWatchProduct(p: any): boolean {
  if (!p) return false;
  return classifyProduct(p).broadCategory === "WATCHES";
}

export function isPantProduct(p: any): boolean {
  if (!p) return false;
  return classifyProduct(p).broadCategory === "BOTTOM";
}

export function isTopProduct(p: any): boolean {
  if (!p) return false;
  return classifyProduct(p).broadCategory === "TOP";
}

export function isShoesProduct(p: any): boolean {
  if (!p) return false;
  return classifyProduct(p).broadCategory === "SHOES";
}

export function isWomenProduct(p: any): boolean {
  if (!p) return false;
  return classifyProduct(p).gender === "WOMEN";
}

/**
 * Normalizes all product fields (category, name, description, images)
 * Respects admin/DB category with HIGHEST priority!
 */
export function normalizeProductData(product: any): any {
  if (!product) return product;

  let name = (product.name || "").trim();
  const rawCat = (product.category || "").trim();
  const catLower = rawCat.toLowerCase();

  // If the admin/DB categorizes this product as Men's, ensure the title displays Men's
  if (catLower.includes("men") && !catLower.includes("women") && name.includes("Women's")) {
    name = name.replace("Women's", "Men's");
  }

  // Resolve classification
  const { broadCategory, gender } = classifyProduct({ ...product, name, category: rawCat });

  // Compute canonical display category if needed
  let category = rawCat;
  if (!rawCat || rawCat === "All") {
    if (broadCategory === "BOTTOM") {
      category = gender === "WOMEN" ? "Women's Baggy" : "Men's Baggy";
    } else if (broadCategory === "WATCHES") {
      category = gender === "WOMEN" ? "Women's Watches" : "Men's Watches";
    } else if (broadCategory === "TOP") {
      category = "Top";
    } else if (broadCategory === "SHOES") {
      category = "Shoes";
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
    image_url,
    images: imgs.length > 0 ? imgs : [image_url],
  };
}

/**
 * Filter products cleanly based on category selection.
 * Uses the canonical isProductMatchingFilter from categories.ts.
 */
export function isProductInCategory(product: any, categoryName: string): boolean {
  if (!categoryName || categoryName === "All") return true;
  const { broad, gender } = parseCategoryParam(categoryName);
  return isProductMatchingFilter(product, broad, gender);
}
