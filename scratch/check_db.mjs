import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 1).single();
  const currentCoupons = settings.coupons || [];
  
  const defaultSlides = [
    {
      id: "slide-1",
      badge: "LIMITED EDITION DROP",
      subtitle: "URBAN HOROLOGY & STREETWEAR",
      titleWhite: "BAGGY FIT",
      titleGold: "CARGO PANTS",
      description1: "Tailored with heavyweight 480GSM Japanese cotton-twill.",
      description2: "Engineered volume and liquid drape motion.",
      image: "/images/pants.png",
      link: "/pants"
    },
    {
      id: "slide-2",
      badge: "SWISS MOVEMENT ARCHITECTURE",
      subtitle: "PRECISION TIMEPIECES",
      titleWhite: "CHRONO",
      titleGold: "EXECUTIVE",
      description1: "Sapphire crystal dome with 316L surgical stainless steel.",
      description2: "Designed for leaders of tomorrow.",
      image: "/images/watch.png",
      link: "/watches"
    },
    {
      id: "slide-3",
      badge: "FALL / WINTER 2026",
      subtitle: "ESSENTIAL APPAREL",
      titleWhite: "HEAVYWEIGHT",
      titleGold: "STREET TEES",
      description1: "Ultra-dense drop-shoulder silhouette with gold embroidery.",
      description2: "Subtle luxury for everyday wear.",
      image: "/images/t-shirt.png",
      link: "/shop?category=T-Shirts"
    }
  ];

  // Preserve normal coupons and attach _hero_slides entry
  const updatedCoupons = [
    ...currentCoupons.filter((c) => c._type !== '_hero_slides'),
    { _type: '_hero_slides', slides: defaultSlides }
  ];

  const { data, error } = await supabase
    .from('store_settings')
    .update({ coupons: updatedCoupons })
    .eq('id', 1)
    .select('*');

  if (error) {
    console.error("ERROR:", error);
  } else {
    console.log("UPDATED STORE SETTINGS WITH HERO SLIDES SUCCESS!");
  }
}
run();
