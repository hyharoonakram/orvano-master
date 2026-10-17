const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://rxdxykvpnzwontnmgikb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZHh5a3Zwbnp3b250bm1naWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MzcwODcsImV4cCI6MjA5NzUxMzA4N30.nzOAQXp71tjax6KeX4inf7Dc9WUeM3cbg6pB09rk2IE'
);

function normalizeImg(url) {
  if (!url) return '/images/watch.png';
  if (url.includes('/product-images/')) {
    const filename = url.split('/product-images/').pop().split('?')[0];
    return `/images/${filename}`;
  }
  return url;
}

async function exportSql() {
  console.log('Fetching products, users & settings from old Supabase...');
  const { data: products, error: pErr } = await supabase.from('products').select('*');
  const { data: users, error: uErr } = await supabase.from('users').select('*');
  const { data: settings, error: sErr } = await supabase.from('store_settings').select('*').eq('id', 1).single();

  if (pErr) console.error('Product fetch error:', pErr);
  if (uErr) console.error('Users fetch error:', uErr);
  if (sErr) console.error('Settings fetch error:', sErr);

  let sql = '-- ORVANO AUTOMATED MYSQL DATA INSERT SCRIPT FOR HOSTINGER PHPMYADMIN\n\n';

  // 1. Users Table Insert
  sql += '-- 1. Users & Admin Accounts\n';
  if (users && users.length > 0) {
    console.log(`Found ${users.length} users!`);
    for (const u of users) {
      const fName = (u.first_name || 'Admin').replace(/'/g, "''");
      const lName = (u.last_name || 'User').replace(/'/g, "''");
      const pin = (u.admin_pin || '123456').replace(/'/g, "''");
      const addr = JSON.stringify(u.address || {}).replace(/'/g, "''");
      sql += `INSERT INTO users (id, first_name, last_name, avatar_url, address, is_admin, admin_pin) VALUES ('${u.id}', '${fName}', '${lName}', '${u.avatar_url || ''}', '${addr}', ${u.is_admin ? 1 : 0}, '${pin}') ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), is_admin=VALUES(is_admin), admin_pin=VALUES(admin_pin);\n`;
    }
  }

  // 2. Products Table Insert
  sql += '\n-- 2. Store Products\n';
  if (products && products.length > 0) {
    console.log(`Found ${products.length} products!`);
    for (const p of products) {
      const rawImg = p.image_url || '/images/watch.png';
      const imgUrl = normalizeImg(rawImg);

      const rawImgs = Array.isArray(p.images) ? p.images : [rawImg];
      const imgs = rawImgs.map(i => normalizeImg(i));

      const nameEsc = (p.name || '').replace(/'/g, "''");
      const descEsc = (p.description || '').replace(/'/g, "''");
      const catEsc = (p.category || '').replace(/'/g, "''");
      const glowEsc = (p.glow_color || 'rgba(35, 95, 175, 0.55)').replace(/'/g, "''");
      const jsonImgs = JSON.stringify(imgs).replace(/'/g, "''");

      sql += `INSERT INTO products (id, name, description, price, original_price, category, image_url, images, stock_quantity, glow_color, display_order) VALUES ('${p.id}', '${nameEsc}', '${descEsc}', ${p.price}, ${p.original_price ? p.original_price : 'NULL'}, '${catEsc}', '${imgUrl}', '${jsonImgs}', ${p.stock_quantity || 10}, '${glowEsc}', ${p.display_order || 1}) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image_url=VALUES(image_url), images=VALUES(images);\n`;
    }
  }

  // 3. Store Settings Insert
  sql += '\n-- 3. Store Settings\n';
  if (settings) {
    const bankEsc = (settings.bank_name || 'Premium Global Bank').replace(/'/g, "''");
    const titleEsc = (settings.account_title || 'Orvano Official').replace(/'/g, "''");
    const numEsc = (settings.account_number || '03410867454').replace(/'/g, "''");
    const ibanEsc = (settings.iban || 'PK36 PGBK 1234 5678 9012').replace(/'/g, "''");
    const phoneEsc = (settings.phone_number || '+1 (800) 555-0199').replace(/'/g, "''");
    const waEsc = (settings.whatsapp_number || '+92 300 0138707').replace(/'/g, "''");
    const instaEsc = (settings.instagram_url || 'https://instagram.com/orvano.official').replace(/'/g, "''");
    const tiktokEsc = (settings.tiktok_url || 'https://tiktok.com/@orvano').replace(/'/g, "''");
    const fbEsc = (settings.facebook_url || 'https://facebook.com/orvano').replace(/'/g, "''");

    const heroEntry = Array.isArray(settings.coupons) ? settings.coupons.find(c => c._type === '_hero_slides') : null;
    const rawSlides = heroEntry?.slides || settings.hero_slides || [];
    const cleanSlides = rawSlides.map(s => ({
      ...s,
      image: normalizeImg(s.image)
    }));

    const popupEntry = Array.isArray(settings.coupons) ? settings.coupons.find(c => c._type === '_popup_cards') : null;
    const rawPopups = popupEntry?.popups || settings.popup_cards || [];
    const cleanPopups = rawPopups.map(p => ({
      ...p,
      image: normalizeImg(p.image)
    }));

    const pkgEntry = Array.isArray(settings.coupons) ? settings.coupons.find(c => c._type === '_packaging_images') : null;
    const watchPkgImg = normalizeImg(pkgEntry?.watch_packaging_image || settings.watch_packaging_image || '/images/box-watch.jpeg');
    const pantsPkgImg = normalizeImg(pkgEntry?.pants_packaging_image || settings.pants_packaging_image || '/images/pants.png');
    const watchDescEsc = (pkgEntry?.watch_packaging_desc || settings.watch_packaging_desc || 'Every ORVANO timepiece is delivered in our custom velvet-lined matte black presentation box with shockproof foam protection and gold foil embossing.').replace(/'/g, "''");
    const pantsDescEsc = (pkgEntry?.pants_packaging_desc || settings.pants_packaging_desc || 'Our baggy cargo pants are packaged in custom heavy-duty seal bags with metallic gold hardware details and signature ORVANO collector card.').replace(/'/g, "''");

    const cleanCoupons = Array.isArray(settings.coupons) ? settings.coupons.filter(c => c._type !== '_hero_slides' && c._type !== '_popup_cards' && c._type !== '_packaging_images' && c._type !== '_shipping_settings') : [];

    const slidesEsc = JSON.stringify(cleanSlides).replace(/'/g, "''");
    const popupsEsc = JSON.stringify(cleanPopups).replace(/'/g, "''");
    const couponsEsc = JSON.stringify(cleanCoupons).replace(/'/g, "''");

    sql += `INSERT INTO store_settings (id, bank_name, account_title, account_number, iban, hero_watch_image, hero_pants_image, premium_box_image, phone_number, whatsapp_number, instagram_url, tiktok_url, facebook_url, hero_slides, popup_cards, coupons, shipping_fee, free_shipping_threshold, watch_packaging_image, watch_packaging_desc, pants_packaging_image, pants_packaging_desc) VALUES (1, '${bankEsc}', '${titleEsc}', '${numEsc}', '${ibanEsc}', '/images/watch.png', '/images/pants.png', '/images/box-watch.jpeg', '${phoneEsc}', '${waEsc}', '${instaEsc}', '${tiktokEsc}', '${fbEsc}', '${slidesEsc}', '${popupsEsc}', '${couponsEsc}', ${settings.shipping_fee || 0}, ${settings.free_shipping_threshold || 0}, '${watchPkgImg}', '${watchDescEsc}', '${pantsPkgImg}', '${pantsDescEsc}') ON DUPLICATE KEY UPDATE bank_name=VALUES(bank_name), account_title=VALUES(account_title), account_number=VALUES(account_number), iban=VALUES(iban), phone_number=VALUES(phone_number), whatsapp_number=VALUES(whatsapp_number), instagram_url=VALUES(instagram_url), tiktok_url=VALUES(tiktok_url), facebook_url=VALUES(facebook_url), hero_slides=VALUES(hero_slides), popup_cards=VALUES(popup_cards), coupons=VALUES(coupons), shipping_fee=VALUES(shipping_fee), free_shipping_threshold=VALUES(free_shipping_threshold), watch_packaging_image=VALUES(watch_packaging_image), watch_packaging_desc=VALUES(watch_packaging_desc), pants_packaging_image=VALUES(pants_packaging_image), pants_packaging_desc=VALUES(pants_packaging_desc);\n`;
  }

  fs.writeFileSync('supabase/insert_data.sql', sql);
  console.log('🎉 Successfully generated 100% complete supabase/insert_data.sql file!');
}

exportSql().catch(err => console.error(err));
