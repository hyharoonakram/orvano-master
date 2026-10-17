"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  const subtotal = getTotal();

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading text-foreground uppercase tracking-wider"
          >
            Your Cart
          </motion.h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-foreground/10 pb-4 mb-8 text-foreground/50 text-xs tracking-widest uppercase">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-8">
              {items.length === 0 ? (
                <div className="py-12 text-center text-foreground/50 flex flex-col items-center">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
                </div>
              ) : items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center bg-surface p-4 border border-foreground/5"
                >
                  {/* Product Info */}
                  <div className="col-span-6 w-full flex items-center gap-6">
                    <Link href={`/product/${item.id}`} className="relative w-24 h-24 bg-foreground/5 flex-shrink-0 group block">
                      <Image 
                        src={item.image_url || "/images/watch.png"} 
                        alt={item.name} 
                        fill 
                        sizes="96px"
                        className="object-contain p-2 mix-blend-screen group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div>
                      <Link href={`/product/${item.id}`} className="hover:text-[#D4AF37] transition-colors">
                        <h3 className="text-foreground font-medium tracking-wide">{item.name}</h3>
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-foreground/40 hover:text-red-400 text-xs tracking-widest uppercase mt-2 flex items-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 w-full flex justify-between md:block md:text-center mt-4 md:mt-0">
                    <span className="md:hidden text-foreground/50 text-xs uppercase tracking-widest">Price:</span>
                    <span className="text-foreground/80 tracking-wider">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 w-full flex justify-between md:justify-center mt-4 md:mt-0">
                    <span className="md:hidden text-foreground/50 text-xs uppercase tracking-widest">Quantity:</span>
                    <div className="flex items-center border border-foreground/20">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-2 text-foreground/60 hover:text-[#D4AF37] transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-foreground text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-foreground/60 hover:text-[#D4AF37] transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 w-full flex justify-between md:block md:text-right mt-4 md:mt-0">
                    <span className="md:hidden text-foreground/50 text-xs uppercase tracking-widest">Total:</span>
                    <span className="text-[#D4AF37] tracking-wider font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Link href="/shop" className="text-foreground/60 hover:text-foreground text-sm uppercase tracking-widest transition-colors border-b border-transparent hover:border-foreground pb-1">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-surface border border-foreground/5 p-8 sticky top-32">
              <h3 className="text-foreground font-heading text-xl tracking-widest uppercase mb-8 border-b border-foreground/10 pb-4">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Subtotal</span>
                  <span className="tracking-wider">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Shipping</span>
                  <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Taxes</span>
                  <span className="text-foreground/50 text-xs italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-foreground/10 pt-4 mb-8 flex justify-between items-end">
                <span className="text-foreground font-bold tracking-widest uppercase">Total</span>
                <span className="text-3xl font-heading text-[#D4AF37]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button size="lg" className="w-full text-sm">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-foreground/40 text-xs text-center mt-6 uppercase tracking-wider leading-relaxed">
                Taxes and shipping calculated at checkout. <br/> 
                <Link href="/faq" className="underline hover:text-foreground">Review our return policy.</Link>
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
