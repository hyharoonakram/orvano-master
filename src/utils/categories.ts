export type BroadCategory = 'TOP' | 'BOTTOM' | 'WATCHES' | 'SHOES' | 'OTHER';
export type SubCategory = 'MEN' | 'WOMEN' | 'ALL';

export interface CategoryClassification {
  broadCategory: BroadCategory;
  gender: 'MEN' | 'WOMEN';
  broadLabel: string;
  subLabel: string;
}

export const BROAD_CATEGORIES: { id: BroadCategory; label: string; href: string }[] = [
  { id: 'TOP', label: 'Top', href: '/shop?category=TOP' },
  { id: 'BOTTOM', label: 'Bottom', href: '/pants' },
  { id: 'WATCHES', label: 'Watches', href: '/watches' },
  { id: 'SHOES', label: 'Shoes', href: '/shop?category=SHOES' },
];

export const SUBCATEGORIES: { id: SubCategory; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'MEN', label: 'Men (Male)' },
  { id: 'WOMEN', label: 'Women (Female)' },
];

/**
 * Classifies any product into one of the 4 broad categories (TOP, BOTTOM, WATCHES, SHOES)
 * and subcategory (MEN or WOMEN).
 *
 * NOTE: The category assigned in Admin / Database ALWAYS takes HIGHEST PRIORITY!
 */
export function classifyProduct(product: any): CategoryClassification {
  if (!product) {
    return {
      broadCategory: 'OTHER',
      gender: 'MEN',
      broadLabel: 'Other',
      subLabel: 'Men',
    };
  }

  const cat = (product.category || '').toLowerCase().trim();
  const name = (product.name || '').toLowerCase().trim();
  const desc = (product.description || '').toLowerCase().trim();

  // 1. Determine Broad Category
  let broadCategory: BroadCategory = 'OTHER';

  // Specific check for BOTTOM (Pants, Baggy, Jeans, Trousers, Cargo)
  const isBottom =
    cat.includes('bottom') ||
    cat.includes('pant') ||
    cat.includes('baggy') ||
    cat.includes('jean') ||
    cat.includes('cargo') ||
    cat.includes('trouser') ||
    (!cat.includes('watch') && !cat.includes('top') && !cat.includes('shirt') && !cat.includes('shoe') &&
      (name.includes('pant') ||
        name.includes('baggy') ||
        name.includes('jean') ||
        name.includes('cargo') ||
        name.includes('wide-leg') ||
        name.includes('trouser') ||
        desc.includes('denim pants') ||
        desc.includes('baggy jeans')));

  // Specific check for WATCHES (Rolex, Hublot, Patek, etc.)
  const isWatch =
    !isBottom &&
    (cat.includes('watch') ||
      name.includes('watch') ||
      name.includes('chronograph') ||
      name.includes('tourbillon') ||
      name.includes('quartz') ||
      name.includes('automatic') ||
      name.includes('datejust') ||
      name.includes('nautilus') ||
      name.includes('oyster') ||
      name.includes('day-date') ||
      name.includes('rolex') ||
      name.includes('hublot') ||
      name.includes('patek') ||
      name.includes('citizen') ||
      name.includes('rado') ||
      name.includes('seiko') ||
      name.includes('dieovale') ||
      name.includes('matturi') ||
      name.includes('portive') ||
      name.includes('timepiece'));

  // Specific check for TOP (T-Shirts, Shirts, Hoodies, Tops, Sweaters, Outerwear)
  const isTop =
    !isBottom &&
    !isWatch &&
    (cat.includes('top') ||
      cat.includes('shirt') ||
      cat.includes('tee') ||
      cat.includes('hoodie') ||
      cat.includes('sweater') ||
      cat.includes('jacket') ||
      name.includes('t-shirt') ||
      name.includes('tshirt') ||
      name.includes('hoodie') ||
      name.includes('sweater') ||
      name.includes('jacket') ||
      name.includes('shirt'));

  // Specific check for SHOES (Sneakers, Shoes, Footwear, Boots, Loafers)
  const isShoes =
    !isBottom &&
    !isWatch &&
    !isTop &&
    (cat.includes('shoe') ||
      cat.includes('sneaker') ||
      cat.includes('footwear') ||
      cat.includes('boot') ||
      cat.includes('loafer') ||
      name.includes('shoe') ||
      name.includes('sneaker') ||
      name.includes('footwear'));

  if (isBottom) broadCategory = 'BOTTOM';
  else if (isWatch) broadCategory = 'WATCHES';
  else if (isTop) broadCategory = 'TOP';
  else if (isShoes) broadCategory = 'SHOES';

  // 2. Determine Subcategory (Gender: MEN or WOMEN)
  // HIGHEST PRIORITY: If admin set product.category to "Men's..." or "Women's...", that ALWAYS WINS!
  let gender: 'MEN' | 'WOMEN' = 'MEN';

  if (cat.includes('women') || cat.includes('female') || cat.includes('ladies')) {
    gender = 'WOMEN';
  } else if (cat.includes('men') || cat.includes('male') || cat.includes('gents')) {
    gender = 'MEN';
  } else {
    // Only fallback to name if category is generic (e.g. "Watches", "Pants", "Top", "Shoes")
    const isFemaleName =
      name.includes('women') ||
      name.includes('female') ||
      name.includes('ladies') ||
      name.includes('duo women') ||
      name.includes('bracelet watch for women');

    gender = isFemaleName ? 'WOMEN' : 'MEN';
  }

  const broadLabels: Record<BroadCategory, string> = {
    TOP: 'Top',
    BOTTOM: 'Bottom',
    WATCHES: 'Watches',
    SHOES: 'Shoes',
    OTHER: 'Other',
  };

  return {
    broadCategory,
    gender,
    broadLabel: broadLabels[broadCategory] || 'Other',
    subLabel: gender === 'WOMEN' ? 'Women' : 'Men',
  };
}

/**
 * Checks if a product matches the selected broad category and subcategory (gender).
 */
export function isProductMatchingFilter(
  product: any,
  selectedBroad: string = 'All',
  selectedGender: string = 'All'
): boolean {
  const { broadCategory, gender } = classifyProduct(product);

  // Broad category check
  if (selectedBroad && selectedBroad !== 'All') {
    const sBroad = selectedBroad.toUpperCase();
    if (sBroad === 'WATCHES' || sBroad === 'WATCH') {
      if (broadCategory !== 'WATCHES') return false;
    } else if (sBroad === 'BOTTOM' || sBroad === 'BOTTOMS' || sBroad === 'PANTS' || sBroad === 'BAGGY') {
      if (broadCategory !== 'BOTTOM') return false;
    } else if (sBroad === 'TOP' || sBroad === 'TOPS' || sBroad === 'T-SHIRTS' || sBroad === 'SHIRT' || sBroad === 'HOODIE') {
      if (broadCategory !== 'TOP') return false;
    } else if (sBroad === 'SHOES' || sBroad === 'SHOE' || sBroad === 'SNEAKERS') {
      if (broadCategory !== 'SHOES') return false;
    } else {
      const catLower = (product.category || '').toLowerCase();
      if (!catLower.includes(selectedBroad.toLowerCase())) return false;
    }
  }

  // Subcategory (gender) check
  if (selectedGender && selectedGender !== 'All') {
    const sGen = selectedGender.toUpperCase();
    if (sGen === 'WOMEN' || sGen === 'FEMALE') {
      if (gender !== 'WOMEN') return false;
    } else if (sGen === 'MEN' || sGen === 'MALE') {
      if (gender !== 'MEN') return false;
    }
  }

  return true;
}

/**
 * Normalizes category query parameters into broadCategory and gender.
 */
export function parseCategoryParam(categoryParam: string | null): { broad: string; gender: string } {
  if (!categoryParam || categoryParam === 'All') {
    return { broad: 'All', gender: 'All' };
  }

  const p = categoryParam.toLowerCase().trim();

  // Women's Watches
  if (p.includes('women') && p.includes('watch')) {
    return { broad: 'WATCHES', gender: 'WOMEN' };
  }

  // Men's Watches
  if (p.includes('men') && p.includes('watch')) {
    return { broad: 'WATCHES', gender: 'MEN' };
  }

  // Women's Baggy / Women's Bottom / Women's Pants / Women's Clothing
  if (p.includes('women') && (p.includes('baggy') || p.includes('pant') || p.includes('bottom') || p.includes('jean') || p.includes('clothing'))) {
    return { broad: 'BOTTOM', gender: 'WOMEN' };
  }

  // Men's Baggy / Men's Bottom / Men's Pants
  if (p.includes('men') && (p.includes('baggy') || p.includes('pant') || p.includes('bottom') || p.includes('jean'))) {
    return { broad: 'BOTTOM', gender: 'MEN' };
  }

  // General broad categories
  if (p === 'watches' || p === 'watch') {
    return { broad: 'WATCHES', gender: 'All' };
  }

  if (p === 'bottom' || p === 'bottoms' || p === 'pants' || p === 'baggy') {
    return { broad: 'BOTTOM', gender: 'All' };
  }

  if (p === 'top' || p === 'tops' || p === 't-shirts' || p === 't-shirt' || p === 'shirt' || p === 'hoodies') {
    return { broad: 'TOP', gender: 'All' };
  }

  if (p === 'shoes' || p === 'shoe') {
    return { broad: 'SHOES', gender: 'All' };
  }

  // Generic Gender
  if (p === 'women' || p === 'female') {
    return { broad: 'All', gender: 'WOMEN' };
  }

  if (p === 'men' || p === 'male') {
    return { broad: 'All', gender: 'MEN' };
  }

  return { broad: categoryParam, gender: 'All' };
}
