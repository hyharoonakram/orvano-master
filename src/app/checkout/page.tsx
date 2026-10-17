"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ShieldCheck, Lock, Landmark, Banknote, AlertCircle, CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  const [mounted, setMounted] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [bankDetails, setBankDetails] = useState({
    bank_name: "Premium Global Bank",
    account_title: "Orvano Official",
    account_number: "1234-5678-9012",
    iban: "PK36 PGBK 1234 5678 9012"
  });

  const [userProfile, setUserProfile] = useState<any>(null);

  // Coupon States
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [couponCode, setCouponCodeInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);

  const [contact, setContact] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const supabase = createClient();
      const { data: settingsData } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (settingsData) {
        setBankDetails({
          bank_name: settingsData.bank_name || "Premium Global Bank",
          account_title: settingsData.account_title || "Orvano Official",
          account_number: settingsData.account_number || "1234-5678-9012",
          iban: settingsData.iban || "PK36 PGBK 1234 5678 9012"
        });
        const shippingEntry = Array.isArray(settingsData.coupons) ? settingsData.coupons.find((c: any) => c._type === '_shipping_settings') : null;
        const fee = shippingEntry?.shipping_fee ?? settingsData.shipping_fee ?? 0;
        const threshold = shippingEntry?.free_shipping_threshold ?? settingsData.free_shipping_threshold ?? 0;

        const cleanCoupons = Array.isArray(settingsData.coupons) 
          ? settingsData.coupons.filter((c: any) => c._type !== '_hero_slides' && c._type !== '_popup_cards' && c._type !== '_shipping_settings') 
          : [];

        setAvailableCoupons(cleanCoupons);
        setShippingFee(Number(fee) || 0);
        setFreeShippingThreshold(Number(threshold) || 0);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) {
          setUserProfile(profileData);
          setContact(prev => ({
            ...prev,
            email: user.email || prev.email,
            firstName: profileData.first_name || prev.firstName,
            lastName: profileData.last_name || prev.lastName,
          }));
        } else {
          setContact(prev => ({
            ...prev,
            email: user.email || prev.email,
          }));
        }
      }
    };
    fetchData();
  }, []);

  const subtotal = getTotal();
  const shipping = (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) ? 0 : shippingFee;
  const discountAmount = activeCoupon ? Math.round(subtotal * (activeCoupon.discount / 100)) : 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    let userId = 'guest';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const orderPayload = {
      user_id: userId,
      status: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
      total_amount: total,
      shipping_address: {
        ...contact,
        payment_method: paymentMethod,
        trx_id: paymentMethod === 'bank' ? trxId : null
      },
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      // 1. Direct MySQL Order Insert
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save order');
      }
    } catch (apiErr: any) {
      console.warn('API Order Insert Error, attempting Supabase fallback:', apiErr);
      
      // 2. Supabase Fallback Insert
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            status: paymentMethod === 'cod' ? 'pending' : 'awaiting_payment',
            total_amount: total,
            shipping_address: orderPayload.shipping_address
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (orderData) {
          const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price
          }));
          await supabase.from('order_items').insert(orderItems);
        }
      } catch (sbErr: any) {
        setError(sbErr.message || apiErr.message || "Failed to create order");
        setLoading(false);
        return;
      }
    }

    // Success!
    clearCart();
    setSuccess(true);
    setLoading(false);
  };

  const handleUseSavedAddress = () => {
    if (userProfile && userProfile.address) {
      setContact(prev => ({
        ...prev,
        firstName: userProfile.first_name || prev.firstName,
        lastName: userProfile.last_name || prev.lastName,
        address: userProfile.address.street || prev.address,
        city: userProfile.address.city || prev.city,
        state: userProfile.address.state || prev.state,
        zip: userProfile.address.zip || prev.zip,
        phone: userProfile.phone || prev.phone,
      }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const found = availableCoupons.find(c => c.code === code);
    if (found) {
      setActiveCoupon(found);
      setCouponCodeInput("");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
  };

  if (!mounted) return null;

  if (success) {
    return (
      <main className="flex min-h-screen flex-col bg-background pt-20">
        <Navbar />
        <section className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
          <h1 className="text-4xl font-heading text-foreground mb-4 uppercase tracking-widest">Order Confirmed</h1>
          <p className="text-foreground/60 max-w-md mb-8 tracking-wide">
            Thank you for your purchase. Your order has been placed and is being processed. 
            You can track its status in your account dashboard.
          </p>
          <Button onClick={() => router.push("/account")} size="lg">
            View My Orders
          </Button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/5 py-12">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading text-foreground uppercase tracking-wider"
          >
            Secure Checkout
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center justify-center text-foreground/50 text-xs tracking-widest uppercase"
          >
            <Lock className="w-3 h-3 mr-2" /> 256-Bit Encryption
          </motion.div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="lg:w-2/3 space-y-12">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-sm flex items-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <form id="checkout-form" onSubmit={handleCheckout}>
              {/* Contact Information */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-surface border border-foreground/5 p-8 md:p-12 mb-8"
              >
                <h2 className="text-xl font-heading text-foreground uppercase tracking-widest mb-6 pb-4 border-b border-foreground/10">
                  1. Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">Email Address</label>
                    <input required type="email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Enter your email" />
                  </div>
                </div>
              </motion.div>

              {/* Shipping Address */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface border border-foreground/5 p-8 md:p-12 mb-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-foreground/10 gap-4">
                  <h2 className="text-xl font-heading text-foreground uppercase tracking-widest">
                    2. Shipping Address
                  </h2>
                  {userProfile?.address && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleUseSavedAddress}
                      className="text-xs font-bold tracking-wider"
                    >
                      Use Saved Address
                    </Button>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">First Name</label>
                      <input required type="text" value={contact.firstName} onChange={e => setContact({...contact, firstName: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">Last Name</label>
                      <input required type="text" value={contact.lastName} onChange={e => setContact({...contact, lastName: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">Address</label>
                    <input required type="text" value={contact.address} onChange={e => setContact({...contact, address: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Street address or P.O. Box" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">City</label>
                      <input required type="text" value={contact.city} onChange={e => setContact({...contact, city: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">State</label>
                      <input required type="text" value={contact.state} onChange={e => setContact({...contact, state: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">ZIP Code</label>
                      <input required type="text" value={contact.zip} onChange={e => setContact({...contact, zip: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground/60 text-xs tracking-widest uppercase block">Phone</label>
                    <input required type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface border border-foreground/5 p-8 md:p-12"
              >
                <h2 className="text-xl font-heading text-foreground uppercase tracking-widest mb-6 pb-4 border-b border-foreground/10">
                  3. Payment
                </h2>
                <div className="space-y-6">

                  {/* Cash on Delivery Option */}
                  <label 
                    className={`flex flex-col border p-6 rounded-sm cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-foreground/10 bg-background hover:border-foreground/30"}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-[#D4AF37] w-4 h-4 mr-4" 
                        />
                        <span className="text-foreground font-medium tracking-wide">Cash on Delivery (COD)</span>
                      </div>
                      <Banknote className={`w-6 h-6 ${paymentMethod === "cod" ? "text-[#D4AF37]" : "text-foreground/40"}`} />
                    </div>
                  </label>

                  {/* Direct Bank Transfer Option */}
                  <label 
                    className={`flex flex-col border p-6 rounded-sm cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-foreground/10 bg-background hover:border-foreground/30"}`}
                    onClick={() => setPaymentMethod("bank")}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === "bank"} 
                          onChange={() => setPaymentMethod("bank")}
                          className="accent-[#D4AF37] w-4 h-4 mr-4" 
                        />
                        <span className="text-foreground font-medium tracking-wide">Direct Bank Transfer</span>
                      </div>
                      <Landmark className={`w-6 h-6 ${paymentMethod === "bank" ? "text-[#D4AF37]" : "text-foreground/40"}`} />
                    </div>
                    
                    {/* Bank Details & TRX Input */}
                    {paymentMethod === "bank" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 pt-6 border-t border-foreground/10 overflow-hidden"
                      >
                        <div className="bg-background border border-foreground/5 p-4 rounded-sm mb-6">
                          <p className="text-foreground/60 text-sm font-light mb-4">Please transfer the total amount to the following bank account:</p>
                          <div className="space-y-2 text-sm tracking-wide">
                            <div className="flex justify-between"><span className="text-foreground/40 uppercase text-xs tracking-widest">Bank Name</span><span className="text-foreground">{bankDetails.bank_name}</span></div>
                            <div className="flex justify-between"><span className="text-foreground/40 uppercase text-xs tracking-widest">Account Name</span><span className="text-foreground">{bankDetails.account_title}</span></div>
                            <div className="flex justify-between"><span className="text-foreground/40 uppercase text-xs tracking-widest">Account Number</span><span className="text-[#D4AF37] font-bold">{bankDetails.account_number}</span></div>
                            <div className="flex justify-between"><span className="text-foreground/40 uppercase text-xs tracking-widest">IBAN / Routing</span><span className="text-foreground">{bankDetails.iban}</span></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold block">Transaction ID (TRX ID)</label>
                          <input 
                            type="text" 
                            required={paymentMethod === "bank"}
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full bg-background border border-foreground/20 px-4 py-3 text-foreground focus:outline-none focus:border-[#D4AF37] transition-colors" 
                            placeholder="Enter your transaction reference number" 
                          />
                          <p className="text-foreground/40 text-[10px] uppercase tracking-wider mt-1">Your order will not be shipped until the funds have cleared in our account.</p>
                        </div>
                      </motion.div>
                    )}
                  </label>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-[#D4AF37]/30 p-8 sticky top-32"
            >
              <h3 className="text-foreground font-heading text-xl tracking-widest uppercase mb-8 border-b border-foreground/10 pb-4">
                Order Summary
              </h3>
              
              <div className="space-y-6 mb-8 border-b border-foreground/10 pb-8">
                {items.length === 0 ? (
                  <p className="text-foreground/50 text-sm">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-foreground/5 border border-foreground/10 flex-shrink-0 flex justify-center items-center">
                        <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                          {item.quantity}
                        </span>
                        <Image 
                          src={item.image_url} 
                          alt={item.name} 
                          width={40} height={40} 
                          style={{ width: "auto", height: "auto" }}
                          className="object-contain mix-blend-screen"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-foreground text-sm font-medium tracking-wide line-clamp-1 mb-1">{item.name}</h4>
                        <span className="text-[#D4AF37] text-sm tracking-wider font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Form */}
              <div className="border-b border-foreground/10 pb-6 mb-6">
                {activeCoupon ? (
                  <div className="flex items-center justify-between bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2.5 rounded-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37] font-mono">{activeCoupon.code}</span>
                      <span className="text-xs text-foreground/60">({activeCoupon.discount}% Off)</span>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="text-red-500 text-xs hover:underline font-bold">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="COUPON CODE" 
                      className="flex-1 bg-background border border-foreground/20 px-3 py-2 text-xs text-foreground uppercase tracking-widest focus:outline-none focus:border-[#D4AF37] rounded-sm"
                    />
                    <Button type="submit" variant="outline" size="sm" className="h-auto py-2 text-xs font-bold px-4">Apply</Button>
                  </form>
                )}
                {couponError && <p className="text-red-500 text-[10px] uppercase tracking-wider mt-2">{couponError}</p>}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Subtotal</span>
                  <span className="tracking-wider">{formatPrice(subtotal)}</span>
                </div>
                {activeCoupon && (
                  <div className="flex justify-between text-foreground/80">
                    <span className="tracking-wide text-sm font-light text-[#D4AF37]">Discount ({activeCoupon.code})</span>
                    <span className="tracking-wider text-[#D4AF37] font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Shipping</span>
                  <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">
                    {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span className="tracking-wide text-sm font-light">Taxes</span>
                  <span className="tracking-wider text-sm">{formatPrice(0)}</span>
                </div>
              </div>

              <div className="border-t border-foreground/10 pt-4 mb-8 flex justify-between items-end">
                <span className="text-foreground font-bold tracking-widest uppercase text-lg">Total</span>
                <span className="text-3xl font-heading text-[#D4AF37]">
                  {formatPrice(total)}
                </span>
              </div>

              <Button type="submit" form="checkout-form" disabled={items.length === 0 || loading} size="lg" className="w-full text-sm">
                {loading ? "Processing..." : "Complete Order"}
              </Button>

              <div className="mt-8 flex items-center justify-center text-foreground/40 border-t border-foreground/5 pt-6">
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span className="text-xs uppercase tracking-widest font-medium">Guaranteed Safe Checkout</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
