"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Camera, Share2, Video, MessageCircle, Send, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('store_settings')
        .select('instagram_url, tiktok_url, facebook_url, whatsapp_number')
        .eq('id', 1)
        .single();
      
      if (data) {
        setSettings(data);
      }
    };
    fetchSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 pt-16 pb-10 relative overflow-hidden">
      {/* Top Subtle Gold Hairline Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand & Manifesto Column (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/orvano-monogram.png"
                  alt="ORVANO"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full filter drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                ORVANO
              </span>
            </Link>

            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Founded on the principle that an object worth owning should outlive its owner. Every ORVANO timepiece &amp; garment is crafted with uncompromising precision.
            </p>

            {/* City Locations */}
            <div className="text-[11px] font-bold tracking-[0.25em] text-[#D4AF37]/90 uppercase pt-1">
              GENEVA &bull; LONDON &bull; DUBAI &bull; ISLAMABAD
            </div>

            {/* Official Brand Social Media Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href={settings?.instagram_url || "https://instagram.com/wearorvano"}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#E1306C] hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10 transition-all duration-300 shadow-md group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={settings?.tiktok_url || "https://tiktok.com/@orvano"}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#25F4EE] hover:border-[#25F4EE]/50 hover:bg-[#25F4EE]/10 transition-all duration-300 shadow-md group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.34 1.55-1.35 2.56-.04.99.4 1.98 1.16 2.61.88.74 2.13.92 3.19.49.99-.4 1.68-1.37 1.77-2.43.06-2.97.02-5.94.03-8.91V.02z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={settings?.facebook_url || "https://facebook.com/orvano"}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-300 shadow-md group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${settings?.whatsapp_number?.replace(/[^0-9]/g, '') || "923000138707"}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Concierge"
                className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-black transition-all duration-300 shadow-md group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-white/10 pb-3">
              COLLECTIONS
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-light">
              <li>
                <Link href="/watches" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Luxury Watches
                </Link>
              </li>
              <li>
                <Link href="/pants" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Baggy Pants
                </Link>
              </li>
              <li>
                <Link href="/new" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Support Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-white/10 pb-3">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-light">
              <li>
                <Link href="/contact" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Client FAQ
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  VIP Lounge
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white/70 hover:text-[#D4AF37] transition-colors duration-200 block">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4 sm:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-white/10 pb-3">
              NEWSLETTER
            </h4>
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
              Subscribe to receive private invitations to new drops, limited edition releases, and concierge updates.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/5 border border-white/15 focus:border-[#D4AF37] px-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none transition-colors duration-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-bold px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 rounded-md shrink-0 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" /> Joined
                  </>
                ) : (
                  <>
                    Subscribe <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {subscribed && (
              <p className="text-[#D4AF37] text-xs font-medium tracking-wide animate-fade-in">
                &check; Welcome to ORVANO Maison. You are now subscribed.
              </p>
            )}
          </div>

        </div>

        {/* Mid Ribbon - Insured Delivery & Guarantee */}
        <div className="py-6 border-b border-white/10 text-center">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-white/50 uppercase">
            INSURED WORLDWIDE DELIVERY &bull; 5-YEAR INTERNATIONAL WARRANTY &bull; LIFETIME SERVICING
          </p>
        </div>

        {/* Co-Founders Section */}
        <div className="pt-6 text-center px-4">
          <p className="text-xs sm:text-base tracking-[0.14em] sm:tracking-[0.18em] uppercase font-medium text-white/80 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="whitespace-nowrap">Co-Founders:</span>
            <span className="whitespace-nowrap text-[#D4AF37] font-semibold">Haroon Akram</span>
            <span className="text-white/40 font-normal">&amp;</span>
            <span className="whitespace-nowrap text-[#D4AF37] font-semibold">Ahmed Qaiser</span>
          </p>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p className="text-center sm:text-left font-light">
            &copy; {new Date().getFullYear()} ORVANO MAISON S.A. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-6 text-xs font-light">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

