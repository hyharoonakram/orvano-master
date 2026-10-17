import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query('SELECT * FROM store_settings WHERE id = 1 LIMIT 1');
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, data: rows[0] });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      bank_name, 
      account_title, 
      account_number, 
      iban, 
      shipping_fee, 
      free_shipping_threshold,
      hero_slides,
      popup_cards,
      coupons,
      watch_packaging_image,
      watch_packaging_desc,
      pants_packaging_image,
      pants_packaging_desc
    } = body;

    const sql = `
      INSERT INTO store_settings (
        id, bank_name, account_title, account_number, iban, 
        shipping_fee, free_shipping_threshold, hero_slides, popup_cards, 
        coupons, watch_packaging_image, watch_packaging_desc, 
        pants_packaging_image, pants_packaging_desc
      ) VALUES (
        1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON DUPLICATE KEY UPDATE 
        bank_name = VALUES(bank_name),
        account_title = VALUES(account_title),
        account_number = VALUES(account_number),
        iban = VALUES(iban),
        shipping_fee = VALUES(shipping_fee),
        free_shipping_threshold = VALUES(free_shipping_threshold),
        hero_slides = VALUES(hero_slides),
        popup_cards = VALUES(popup_cards),
        coupons = VALUES(coupons),
        watch_packaging_image = VALUES(watch_packaging_image),
        watch_packaging_desc = VALUES(watch_packaging_desc),
        pants_packaging_image = VALUES(pants_packaging_image),
        pants_packaging_desc = VALUES(pants_packaging_desc)
    `;

    const params = [
      bank_name || '',
      account_title || '',
      account_number || '',
      iban || '',
      parseFloat(shipping_fee) || 0,
      parseFloat(free_shipping_threshold) || 0,
      typeof hero_slides === 'string' ? hero_slides : JSON.stringify(hero_slides || []),
      typeof popup_cards === 'string' ? popup_cards : JSON.stringify(popup_cards || []),
      typeof coupons === 'string' ? coupons : JSON.stringify(coupons || []),
      watch_packaging_image || '/images/box-watch.jpeg',
      watch_packaging_desc || '',
      pants_packaging_image || '/images/pants.png',
      pants_packaging_desc || ''
    ];

    await query(sql, params);
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Save settings error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
