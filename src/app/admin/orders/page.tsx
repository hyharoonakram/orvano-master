import { createClient } from '@/utils/supabase/server';
import { OrdersClient } from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    const supabase = await createClient();
    const { data: sbOrders, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users (first_name, last_name, avatar_url),
        order_items (
          id,
          quantity,
          unit_price,
          product:products (name, image_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && sbOrders) {
      orders = sbOrders;
    }
  } catch (err) {
    console.error('AdminOrdersPage Supabase error:', err);
  }

  return <OrdersClient initialOrders={orders || []} />;
}
