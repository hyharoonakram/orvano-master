import { getProducts } from '@/utils/supabase/queries';
import { ProductsClient } from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsClient initialProducts={products || []} />;
}
