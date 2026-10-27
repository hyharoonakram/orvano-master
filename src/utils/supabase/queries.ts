import { unstable_cache } from 'next/cache'
import { createClient } from './server'
import { createStaticClient } from './static'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  original_price: number | null
  category: string
  image_url: string | null
  images: string[]
  stock_quantity: number
  created_at: string
}

export type Order = {
  id: string
  user_id: string
  status: string
  total_amount: number
  shipping_address: any
  created_at: string
  order_items: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  product: Product
}

import { isProductMatchingFilter, parseCategoryParam } from '../categories';

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string' || url.trim() === '') return '/images/watch.png';
  return url.trim();
}

export function normalizeProduct(product: any): Product {
  if (!product) return product;
  const image_url = normalizeImageUrl(product.image_url);
  let imgs: string[] = [];
  if (Array.isArray(product.images)) {
    imgs = product.images.map((img: string) => normalizeImageUrl(img));
  } else if (typeof product.images === 'string') {
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

  // If product is categorized in Men's Baggy in DB, ensure title accurately displays Men's
  let name = product.name || '';
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('men') && !cat.includes('women') && name.includes("Women's")) {
    name = name.replace("Women's", "Men's");
  }

  return {
    ...product,
    name,
    image_url,
    images: imgs.length > 0 ? imgs : [image_url]
  };
}

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });
  return Promise.race([
    Promise.resolve(promise).then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

export const getProducts = unstable_cache(
  async (category?: string): Promise<Product[]> => {
    const supabase = createStaticClient();
    const query = supabase.from('products').select('*').order('created_at', { ascending: false });
    
    const res = await withTimeout(query, 4000, { data: [], error: null } as any);
    const { data, error } = res;
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }
    const allNormalized = (data || []).map(normalizeProduct);
    if (!category || category === 'All') {
      return allNormalized;
    }
    const { broad, gender } = parseCategoryParam(category);
    return allNormalized.filter((p: Product) => isProductMatchingFilter(p, broad, gender));
  },
  ['products-list-cache'],
  { revalidate: 10, tags: ['products'] }
);

export const getProductById = unstable_cache(
  async (id: string): Promise<Product | null> => {
    const supabase = createStaticClient();
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    
    if (error || !data) {
      console.error(`Error fetching product ${id} from Supabase:`, error);
      return null;
    }
    return normalizeProduct(data);
  },
  ['product-detail-cache'],
  { revalidate: 10, tags: ['products'] }
);

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders from Supabase:', error);
    return [];
  }
  return (data || []).map((order: any) => ({
    ...order,
    order_items: (order.order_items || []).map((item: any) => ({
      ...item,
      product: item.product ? normalizeProduct(item.product) : item.product
    }))
  })) as Order[];
}

export const getStoreSettings = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
    if (error || !data) {
      return null;
    }
    
    // Extract hero_slides from coupons array or direct column
    const heroEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_hero_slides') : null;
    const rawHeroSlides = heroEntry?.slides || data.hero_slides || null;
    const heroSlides = Array.isArray(rawHeroSlides)
      ? rawHeroSlides.map((slide: any) => ({
          ...slide,
          image: normalizeImageUrl(slide.image)
        }))
      : null;
    
    // Extract popup_cards from coupons array or direct column
    const popupEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_popup_cards') : null;
    const rawPopupCards = popupEntry?.popups || data.popup_cards || [];
    const popupCards = Array.isArray(rawPopupCards)
      ? rawPopupCards.map((card: any) => ({
          ...card,
          image: normalizeImageUrl(card.image)
        }))
      : [];

    // Extract shipping_settings from coupons array or direct columns
    const shippingEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_shipping_settings') : null;
    const shippingFee = shippingEntry?.shipping_fee ?? data.shipping_fee ?? 0;
    const freeShippingThreshold = shippingEntry?.free_shipping_threshold ?? data.free_shipping_threshold ?? 0;

    // Clean coupons array by removing internal settings entries
    const cleanCoupons = Array.isArray(data.coupons) ? data.coupons.filter((c: any) => c._type !== '_hero_slides' && c._type !== '_popup_cards' && c._type !== '_shipping_settings') : [];

    return {
      ...data,
      coupons: cleanCoupons,
      hero_slides: heroSlides,
      popup_cards: popupCards,
      shipping_fee: shippingFee,
      free_shipping_threshold: freeShippingThreshold,
      watch_packaging_image: normalizeImageUrl(data.watch_packaging_image),
      pants_packaging_image: normalizeImageUrl(data.pants_packaging_image),
    };
  },
  ['store-settings-cache'],
  { revalidate: 10, tags: ['store_settings'] }
);
