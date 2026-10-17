"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="relative z-[99999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#08080A] border-l border-white/10 z-[100000] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-heading tracking-widest uppercase text-[#D4AF37] flex items-center">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                  <ShoppingCart className="w-16 h-16 text-white/20" />
                  <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-[#D4AF37] border-b border-[#D4AF37] pb-1 uppercase tracking-widest text-xs font-bold mt-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-background border border-white/5 p-3 rounded-sm">
                    <div className="relative w-24 h-24 bg-white/5 flex-shrink-0">
                      <Image
                        src={item.image_url || "/images/watch.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest mb-1">{item.category}</p>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-white line-clamp-1">{item.name}</h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500/70 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/20 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-white/60 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-medium text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-white/60 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[#D4AF37] font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60 uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-2xl font-heading text-white">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full bg-[#D4AF37] text-black hover:bg-[#F5D67B] font-bold uppercase tracking-widest py-4 rounded-sm transition-colors flex items-center justify-center">
                    Proceed to Checkout
                  </button>
                </Link>
                <p className="text-center text-[10px] text-white/40 uppercase tracking-widest mt-4">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
