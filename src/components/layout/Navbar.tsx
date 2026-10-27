"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown, Truck, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";

import { normalizeProductData, isProductInCategory } from "@/utils/productCatalog";

const ALL_NAV_CATEGORIES = [
  { label: "Men's Watches", href: "/shop?category=Men's Watches", catName: "Men's Watches", hasDropdown: false },
  { label: "Women's Watches", href: "/shop?category=Women's Watches", catName: "Women's Watches", hasDropdown: false },
  { label: "Women's Baggy", href: "/shop?category=Women's Baggy", catName: "Women's Baggy", hasDropdown: false },
  { label: "Men's Baggy", href: "/shop?category=Men's Baggy", catName: "Men's Baggy", hasDropdown: false },
];

const DEFAULT_NAV_CATEGORIES = [...ALL_NAV_CATEGORIES];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>(DEFAULT_NAV_CATEGORIES);

  const { isCartOpen, openCart, closeCart, isCartShaking, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function filterAvailableNavCategories() {
      const supabase = createClient();
      const { data: products } = await supabase.from('products').select('*');
      if (products) {
        const normalized = products.map(normalizeProductData);
        const available = ALL_NAV_CATEGORIES.filter((cat) =>
          normalized.some((p) => isProductInCategory(p, cat.catName))
        );
        setNavCategories(available);
      }
    }
    filterAvailableNavCategories();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* Luxury Top Announcement Bar (matching design mock) */}
        <div className="w-full bg-[#080809]/95 backdrop-blur-md border-b border-white/[0.08] text-[9.5px] sm:text-[10.5px] font-medium tracking-[0.16em] text-[#C5A55D] py-1.5 px-4 sm:px-8">
          <div className="container mx-auto flex items-center justify-between">
            {/* Left Tagline */}
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-[9px]">&#8212;</span>
              <span className="text-white/80 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
                PREMIUM FASHION &amp; TIMEPIECES FOR A BOLDER YOU
              </span>
              <span className="text-[#D4AF37] text-[9px]">&#8212;</span>
            </div>

            {/* Right Badges */}
            <div className="hidden sm:flex items-center gap-4 text-white/70">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="uppercase text-[9px] sm:text-[10px] tracking-widest text-[#D4AF37] font-semibold">
                  WORLDWIDE SHIPPING
                </span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="uppercase text-[9px] sm:text-[10px] tracking-widest text-white/85 font-semibold">
                  COD AVAILABLE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Navbar */}
        <div
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "bg-black/90 md:bg-black/60 md:backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              : "bg-black/40 backdrop-blur-md border-b border-white/5"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-4">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white hover:text-[#D4AF37] transition-colors p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="group relative flex items-center gap-2.5 shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/orvano-monogram.png"
                  alt="ORVANO"
                  width={36}
                  height={36}
                  priority
                  className="object-contain w-full h-full filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300 font-serif">
                ORVANO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {[
                { label: "Shop", href: "/shop", hasDropdown: false },
                ...navCategories.map((c) => ({
                  label: c.label,
                  href: c.href,
                  hasDropdown: false,
                })),
                { label: "About", href: "/about", hasDropdown: false },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group inline-flex items-center gap-1 text-xs xl:text-sm font-medium tracking-wide text-white/85 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3 h-3 text-white/40 group-hover:text-[#D4AF37] transition-transform duration-300 group-hover:translate-y-0.5" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Action Items: Apple Search Pill, User, Wishlist, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-5 text-white shrink-0">
              {/* Apple-Style Search Input Pill */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-[#D4AF37]/60 text-white/50 hover:text-white transition-all duration-300 text-xs shadow-inner cursor-pointer group"
                aria-label="Search luxury products"
              >
                <Search className="w-3.5 h-3.5 text-white/50 group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-xs font-light text-white/50 group-hover:text-white/80 transition-colors">
                  Search products...
                </span>
                <Search className="w-3 h-3 text-white/30 group-hover:text-[#D4AF37] transition-colors ml-1" />
              </button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-white/80 hover:text-[#D4AF37] transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account */}
              <Link
                href={user ? "/account" : "/login"}
                className="hover:text-[#D4AF37] transition-colors hidden sm:block p-1"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Heart Icon */}
              <Link
                href="/shop"
                className="hover:text-[#D4AF37] transition-colors hidden sm:block p-1 text-white/85"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Icon with Gold Badge */}
              <button
                onClick={openCart}
                className={`hover:text-[#D4AF37] transition-all relative block p-1.5 rounded-full ${
                  isCartShaking ? "bg-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.8)] scale-110" : ""
                }`}
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Minimalist Apple UI Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Portal Mounted Mobile Luxury Menu Overlay */}
      {mounted && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="relative z-[9999]">
              {/* Backdrop Dimmer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md lg:hidden"
              />

              {/* Slide-out Menu Drawer */}
              <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm z-[10000] bg-[#08080A] border-r border-white/10 flex flex-col justify-between p-6 shadow-2xl lg:hidden overflow-y-auto"
              >
                {/* Menu Header */}
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                        <Image
                          src="/images/orvano-monogram.png"
                          alt="ORVANO"
                          width={36}
                          height={36}
                          className="object-contain w-full h-full filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                        />
                      </div>
                      <div>
                        <span className="text-xl font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C]">
                          ORVANO
                        </span>
                        <span className="block text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono mt-0.5">
                          TIMELESS YOURS
                        </span>
                      </div>
                    </div>

                    <button
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#D4AF37] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Account Card Banner */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          {user ? "VIP CLIENT" : "GUEST CLIENT"}
                        </div>
                        <div className="text-[10px] text-white/50">
                          {user ? user.email : "Access your orders & benefits"}
                        </div>
                      </div>
                    </div>

                    <Link 
                      href={user ? "/account" : "/login"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[10px] uppercase font-extrabold tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {user ? "PROFILE" : "SIGN IN"}
                    </Link>
                  </div>

                  {/* Categorized Navigation Links */}
                  <nav className="mt-8 space-y-2">
                    {[
                      { label: "ALL PRODUCTS", href: "/shop" },
                      ...navCategories.map(c => ({ label: c.label.toUpperCase(), href: c.href })),
                      { label: "NEW ARRIVALS", href: "/new" },
                      { label: "THE ORIGIN STORY", href: "/about" },
                      { label: "TRACK ORDER", href: "/track" },
                      { label: "CUSTOMER SUPPORT", href: "/contact" }
                    ].map((item) => (
                      <Link 
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-white/90 hover:text-[#D4AF37] transition-all"
                      >
                        <span className="text-xs font-bold tracking-[0.2em] uppercase font-sans">
                          {item.label}
                        </span>
                        <span className="text-white/20 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all">
                          →
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Menu Footer Contacts */}
                <div className="pt-6 border-t border-white/10 mt-8 space-y-4">
                  <a 
                    href="https://wa.me/923000138707" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-all"
                  >
                    <span>CHAT ON WHATSAPP</span>
                  </a>

                  <div className="text-center text-[10px] text-white/30 uppercase tracking-widest font-mono">
                    © ORVANO • ALL RIGHTS RESERVED
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Cart Drawer connected to global store */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
