"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useCartStore } from "@/lib/store/cartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";

const ALL_NAV_CATEGORIES = [
  { label: "Men's Watches", href: "/shop?category=Men's Watches", catName: "Men's Watches" },
  { label: "Women's Watches", href: "/shop?category=Women's Watches", catName: "Women's Watches" },
  { label: "Watches", href: "/shop?category=Watches", catName: "Watches" },
  { label: "Pants", href: "/pants", catName: "Pants" },
  { label: "T-Shirts", href: "/shop?category=T-Shirts", catName: "T-Shirts" },
  { label: "Hoodies", href: "/shop?category=Hoodies", catName: "Hoodies" },
  { label: "Accessories", href: "/shop?category=Accessories", catName: "Accessories" },
];

function isProductInCategory(productCat: string, categoryName: string): boolean {
  const prodCat = (productCat || "").toLowerCase().trim();
  const activeCat = categoryName.toLowerCase().trim();

  if (prodCat === activeCat) return true;

  if (activeCat.includes("women")) {
    return prodCat.includes("women") || prodCat.includes("ladies") || prodCat.includes("female");
  }

  if (activeCat.includes("men") && !activeCat.includes("women")) {
    return (prodCat.includes("men") && !prodCat.includes("women")) || prodCat.includes("gents") || prodCat.includes("male");
  }

  if (activeCat === "watches") {
    return prodCat.includes("watch");
  }

  if (activeCat === "pants") {
    return prodCat.includes("pant") || prodCat.includes("trouser") || prodCat.includes("cargo");
  }

  if (activeCat === "t-shirts") {
    return prodCat.includes("shirt") || prodCat.includes("tee");
  }

  if (activeCat === "hoodies") {
    return prodCat.includes("hoodie") || prodCat.includes("sweatshirt");
  }

  if (activeCat === "accessories") {
    return prodCat.includes("accessori") || prodCat.includes("box") || prodCat.includes("belt") || prodCat.includes("wallet");
  }

  return false;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [navCategories, setNavCategories] = useState<any[]>([]);

  const { isCartOpen, openCart, closeCart, isCartShaking, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function filterAvailableNavCategories() {
      const supabase = createClient();
      const { data: products } = await supabase.from('products').select('category');
      if (products) {
        const available = ALL_NAV_CATEGORIES.filter((cat) =>
          products.some((p) => isProductInCategory(p.category, cat.catName))
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
      setIsScrolled(window.scrollY > 50);
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/95 md:bg-black/40 md:backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white hover:text-[#D4AF37] transition-colors p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="group relative flex items-center gap-2.5">
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
            <span className="text-xl sm:text-2xl font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300">
              ORVANO
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {[
              { label: "Shop", href: "/shop" },
              ...navCategories.map(c => ({ label: c.label, href: c.href })),
              { label: "About", href: "/about" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs xl:text-sm font-medium tracking-wide text-white/80 hover:text-[#D4AF37] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6 text-white">

            <Link href={user ? "/account" : "/login"} className="hover:text-[#D4AF37] transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            
            {/* Cart Icon */}
            <button 
              onClick={openCart}
              className={`hover:text-[#D4AF37] transition-all relative block p-1.5 rounded-full ${
                isCartShaking ? "bg-[#D4AF37]/20 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.8)] scale-110" : ""
              }`}
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

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
