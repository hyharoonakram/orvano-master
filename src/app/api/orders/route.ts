import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rxdxykvpnzwontnmgikb.supabase.co';
  const isCompactJws = (k?: string) => typeof k === 'string' && k.trim().split('.').length === 3;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY;
  const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE';
  const supabaseKey = (serviceKey && isCompactJws(serviceKey)) ? serviceKey.trim() : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey);
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    // If querying all orders without user/email filter, ensure admin authorization
    if (!userId && !email) {
      const cookieHeader = request.headers.get('cookie') || '';
      const isAdminVerified = cookieHeader.includes('admin_verified=true');
      if (!isAdminVerified) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
      }
    }

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          product:products (name, image_url)
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, status, total_amount, shipping_address, items } = body;

    const orderId = body.id || randomUUID();
    const supabase = getSupabaseAdmin();

    // 1. Insert Order into Supabase
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_id: user_id || 'guest',
      status: status || 'pending',
      total_amount: total_amount || 0,
      shipping_address: shipping_address || {}
    });

    if (orderError) throw orderError;

    // 2. Insert Order Items into Supabase
    if (Array.isArray(items) && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        id: randomUUID(),
        order_id: orderId,
        product_id: item.id || item.product_id,
        quantity: item.quantity || 1,
        unit_price: item.price || item.unit_price || 0
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Supabase Order Creation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    if (!cookieHeader.includes('admin_verified=true')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, status } = body;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    if (!cookieHeader.includes('admin_verified=true')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');
    const supabase = getSupabaseAdmin();

    if (clearAll === 'true') {
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      return NextResponse.json({ success: true, message: 'All orders cleared' });
    }

    if (orderId) {
      await supabase.from('order_items').delete().eq('order_id', orderId);
      await supabase.from('orders').delete().eq('id', orderId);
      return NextResponse.json({ success: true, message: 'Order deleted' });
    }

    return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
