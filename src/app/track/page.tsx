"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Phone,
  ShieldCheck,
  MessageSquare,
  Copy,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Wifi
} from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";
import { createClient } from "@/utils/supabase/client";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || searchParams.get("id") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [underProcessing, setUnderProcessing] = useState<any[]>([]);
  const [delivered, setDelivered] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "delivered">("active");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  const executeSearch = useCallback(async (searchQuery: string, isSilent = false) => {
    if (!searchQuery.trim()) return;

    if (!isSilent) {
      setIsSearching(true);
      setSearchError(null);
    } else {
      setIsLiveUpdating(true);
    }

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (!isSilent) {
          setSearchError(data.message || "Could not fetch tracking data.");
          setUnderProcessing([]);
          setDelivered([]);
        }
      } else {
        setUnderProcessing(data.underProcessing || []);
        setDelivered(data.delivered || []);
        setHasSearched(true);
        setLastUpdatedTime(new Date().toLocaleTimeString());

        if (!isSilent) {
          // Switch tab based on results on initial search
          if ((data.underProcessing || []).length > 0) {
            setActiveTab("active");
          } else if ((data.delivered || []).length > 0) {
            setActiveTab("delivered");
          }
        }
      }
    } catch (err: any) {
      if (!isSilent) {
        setSearchError("Failed to connect to tracking system. Please try again.");
      }
    } finally {
      if (!isSilent) {
        setIsSearching(false);
      } else {
        setTimeout(() => setIsLiveUpdating(false), 800);
      }
    }
  }, []);

  // Auto-search if query param is present or if user logged in
  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    } else {
      const checkUser = async () => {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const { data: profile } = await supabase
            .from("users")
            .select("phone, address")
            .eq("id", session.user.id)
            .single();

          const phone = profile?.phone || profile?.address?.phone;
          if (phone) {
            setQuery(phone);
            executeSearch(phone);
          } else if (session.user.email) {
            setQuery(session.user.email);
            executeSearch(session.user.email);
          }
        }
      };
      checkUser();
    }
  }, [initialQuery, executeSearch]);

  // LIVE REALTIME UPDATES: Supabase Channel Listener + 5s Auto Refresh
  useEffect(() => {
    if (!hasSearched || !query) return;

    // 1. Set up periodic live polling (every 5 seconds)
    const intervalId = setInterval(() => {
      executeSearch(query, true);
    }, 5000);

    // 2. Set up Supabase Realtime channel subscription on orders table
    const supabase = createClient();
    const channel = supabase
      .channel("realtime_orders_track")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders"
        },
        () => {
          // Instantly trigger silent refresh when an admin modifies an order status
          executeSearch(query, true);
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [hasSearched, query, executeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStep = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") return 4;
    if (s === "shipped" || s === "in_transit" || s === "dispatched") return 3;
    if (s === "paid" || s === "processing") return 2;
    return 1;
  };

  const getStatusLabel = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "pending":
        return { label: "Under Processing", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "awaiting_payment":
        return { label: "Awaiting Payment", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" };
      case "paid":
        return { label: "Payment Confirmed", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
      case "processing":
        return { label: "Preparing Dispatch", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
      case "shipped":
      case "in_transit":
      case "dispatched":
        return { label: "In Transit / Shipped", color: "text-[#D4AF37] bg-[#D4AF37]/15 border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]" };
      case "delivered":
      case "completed":
        return { label: "Delivered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "cancelled":
        return { label: "Cancelled", color: "text-red-400 bg-red-500/10 border-red-500/30" };
      default:
        return { label: status.replace("_", " "), color: "text-white/70 bg-white/10 border-white/20" };
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050506] text-white pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D0D10] via-[#050506] to-[#050506] border-b border-white/5 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Direct Live Tracking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-[#D4AF37] mb-6"
          >
            Track Your Order
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-base max-w-2xl mx-auto tracking-wide mb-10 leading-relaxed"
          >
            Apna mobile phone number enter karein. Real-time updates ke sath aap ke <span className="text-[#D4AF37] font-semibold">Under Processing</span> aur dispatched parcels live sync hungay.
          </motion.p>

          {/* Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-[#0D0D10]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 p-2.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all"
          >
            <div className="relative flex-1 flex items-center px-3">
              <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mr-3" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Phone Number (e.g. 03001234567) or Order ID"
                className="w-full bg-transparent text-white placeholder-white/40 text-sm md:text-base focus:outline-none font-medium py-3"
              />
            </div>

            <Button
              type="submit"
              disabled={isSearching}
              className="bg-gradient-to-r from-[#D4AF37] via-[#F5D67B] to-[#D4AF37] text-black font-extrabold uppercase tracking-widest text-xs py-4 px-8 rounded-xl shrink-0 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" /> Track Parcel
                </>
              )}
            </Button>
          </motion.form>

          <div className="flex items-center justify-center gap-3 text-white/40 text-xs mt-4">
            <span>💡 Enter 11-digit mobile number</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Sync Active
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 container mx-auto px-6 py-12 max-w-5xl">
        {searchError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{searchError}</span>
          </motion.div>
        )}

        {hasSearched && (
          <div>
            {/* Live Indicator Banner */}
            <div className="mb-8 bg-[#0D0D10] border border-[#D4AF37]/20 px-5 py-3 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3 text-xs">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative z-10" />
                </div>
                <span className="font-bold text-white uppercase tracking-wider">
                  Realtime Parcel Sync Active
                </span>
                {lastUpdatedTime && (
                  <span className="text-white/40 hidden sm:inline">
                    (Last synced at {lastUpdatedTime})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => executeSearch(query, true)}
                  disabled={isLiveUpdating}
                  className="text-xs text-[#D4AF37] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all"
                  title="Manual Live Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLiveUpdating ? "animate-spin" : ""}`} />
                  <span>{isLiveUpdating ? "Syncing..." : "Refresh Now"}</span>
                </button>
              </div>
            </div>

            {/* Tabs for Under Processing vs Delivered */}
            <div className="flex items-center justify-center gap-4 mb-10 border-b border-white/10 pb-4">
              <button
                onClick={() => setActiveTab("active")}
                className={`relative px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === "active"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Clock className="w-4 h-4" />
                Under Processing / Active
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono font-extrabold ${
                  activeTab === "active" ? "bg-black/20 text-black" : "bg-[#D4AF37]/20 text-[#D4AF37]"
                }`}>
                  {underProcessing.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("delivered")}
                className={`relative px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === "delivered"
                    ? "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                    : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Delivered & Completed
                <span className={`px-2 py-0.5 text-xs rounded-full font-mono font-extrabold ${
                  activeTab === "delivered" ? "bg-black/20 text-black" : "bg-white/20 text-white"
                }`}>
                  {delivered.length}
                </span>
              </button>
            </div>

            {/* Content per Tab */}
            <AnimatePresence mode="wait">
              {activeTab === "active" ? (
                <motion.div
                  key="active-orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                      <Truck className="w-5 h-5" /> Under Processing Orders
                    </h2>
                    <span className="text-xs text-white/40">
                      Live status updates whenever status changes
                    </span>
                  </div>

                  {underProcessing.length === 0 ? (
                    <div className="bg-[#0D0D10] border border-white/10 rounded-2xl p-12 text-center text-white/50">
                      <Package className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]/40" />
                      <h3 className="text-lg font-bold text-white mb-2">No Under-Processing Orders Found</h3>
                      <p className="text-sm text-white/60 max-w-md mx-auto">
                        Is phone number par koi filhaal active/under processing order nahi hai. Agar aap ka order deliver ho chuka hai, tou "Delivered & Completed" tab check karein.
                      </p>
                    </div>
                  ) : (
                    underProcessing.map((order) => (
                      <OrderTrackingCard key={order.id} order={order} formatPrice={formatPrice} copyToClipboard={copyToClipboard} copiedId={copiedId} getStatusStep={getStatusStep} getStatusLabel={getStatusLabel} />
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="delivered-orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Delivered & Past Orders
                    </h2>
                    <span className="text-xs text-white/40">
                      Separated from active processing orders
                    </span>
                  </div>

                  {delivered.length === 0 ? (
                    <div className="bg-[#0D0D10] border border-white/10 rounded-2xl p-12 text-center text-white/50">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500/40" />
                      <h3 className="text-lg font-bold text-white mb-2">No Delivered Orders Found</h3>
                      <p className="text-sm text-white/60 max-w-md mx-auto">
                        Is phone number par koi pichla delivered order recorded nahi hai.
                      </p>
                    </div>
                  ) : (
                    delivered.map((order) => (
                      <OrderTrackingCard key={order.id} order={order} formatPrice={formatPrice} copyToClipboard={copyToClipboard} copiedId={copiedId} getStatusStep={getStatusStep} getStatusLabel={getStatusLabel} isDeliveredSection />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!hasSearched && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-[#0D0D10] border border-white/10 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm mb-2">Phone Number Search</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Apna checkout phone number enter karkay instant processing status aur delivery tracking updates hasil karein.
              </p>
            </div>

            <div className="bg-[#0D0D10] border border-white/10 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
                <Wifi className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm mb-2">Live Realtime Updates</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Jaise hi Admin backend se status change karega, aap ke tracking screen par bina refresh kiye status update ho jayega.
              </p>
            </div>

            <div className="bg-[#0D0D10] border border-white/10 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase text-sm mb-2">24/7 Concierge Support</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Need urgent delivery changes? Contact our dedicated WhatsApp concierge team directly from your parcel timeline.
              </p>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function OrderTrackingCard({
  order,
  formatPrice,
  copyToClipboard,
  copiedId,
  getStatusStep,
  getStatusLabel,
  isDeliveredSection = false
}: {
  order: any;
  formatPrice: (amt: number) => string;
  copyToClipboard: (str: string) => void;
  copiedId: string | null;
  getStatusStep: (status: string) => number;
  getStatusLabel: (status: string) => { label: string; color: string };
  isDeliveredSection?: boolean;
}) {
  const currentStep = getStatusStep(order.status);
  const statusInfo = getStatusLabel(order.status);
  const shortId = (order.id || "").split("-")[0].toUpperCase();
  const orderDate = new Date(order.created_at || Date.now());
  const estDelivery = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const isCancelled = order.status === "cancelled";

  return (
    <div className={`bg-[#0D0D10] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
      isDeliveredSection ? "border-white/10" : "border-[#D4AF37]/40 hover:border-[#D4AF37]"
    }`}>
      {/* Card Top Header */}
      <div className="bg-[#121216] px-6 py-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 uppercase tracking-widest font-mono">Order ID:</span>
            <span className="font-mono font-bold text-base text-white tracking-wider">#ORV-{shortId}</span>
            <button
              onClick={() => copyToClipboard(`ORV-${shortId}`)}
              className="text-white/40 hover:text-[#D4AF37] transition-colors"
              title="Copy Order ID"
            >
              {copiedId === `ORV-${shortId}` ? (
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase">Copied!</span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Placed on {orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.span
            key={order.status}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border transition-all ${statusInfo.color}`}
          >
            {statusInfo.label}
          </motion.span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Visual Step-by-Step Progress Bar (If not cancelled) */}
        {!isCancelled ? (
          <div className="bg-[#050506]/60 border border-white/5 p-6 rounded-2xl">
            <div className="flex justify-between items-center text-xs text-white/50 mb-6 uppercase tracking-wider">
              <span className="font-bold text-white/80">Fulfillment Status</span>
              <span>Est. Delivery: <strong className="text-[#D4AF37]">{estDelivery.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong></span>
            </div>

            <div className="relative">
              {/* Background Line */}
              <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1 bg-white/10 z-0" />
              {/* Active Line */}
              <motion.div
                className="absolute left-0 top-5 -translate-y-1/2 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5D67B] to-[#D4AF37] z-0 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                initial={false}
                animate={{
                  width: currentStep === 1 ? "0%" : currentStep === 2 ? "33%" : currentStep === 3 ? "66%" : "100%"
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <div className="relative z-10 flex justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: currentStep >= 1 ? [1, 1.15, 1] : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0D0D10] font-bold text-xs ${
                      currentStep >= 1 ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white/40"
                    }`}
                  >
                    ✓
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${currentStep >= 1 ? "text-white" : "text-white/40"}`}>
                    Placed
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: currentStep >= 2 ? [1, 1.15, 1] : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0D0D10] font-bold text-xs ${
                      currentStep >= 2 ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {currentStep >= 2 ? "✓" : "2"}
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${currentStep >= 2 ? "text-white" : "text-white/40"}`}>
                    Confirmed
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: currentStep >= 3 ? [1, 1.15, 1] : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0D0D10] font-bold text-xs ${
                      currentStep >= 3 ? "bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {currentStep >= 3 ? <Truck className="w-4 h-4 text-black animate-pulse" /> : "3"}
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${currentStep >= 3 ? "text-[#D4AF37]" : "text-white/40"}`}>
                    In Transit
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    animate={{ scale: currentStep === 4 ? [1, 1.15, 1] : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0D0D10] font-bold text-xs ${
                      currentStep === 4 ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {currentStep === 4 ? "✓" : "4"}
                  </motion.div>
                  <span className={`text-xs font-bold mt-2 uppercase tracking-wider ${currentStep === 4 ? "text-emerald-400" : "text-white/40"}`}>
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-xs text-red-300/80">If you believe this is an error, please contact our support team.</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-2">
            Items Included ({order.order_items?.length || 0})
          </h4>
          <div className="divide-y divide-white/5">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-lg p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product?.image_url || "/images/watch.png"}
                    alt={item.product?.name || "Product"}
                    className="max-w-full max-h-full object-contain mix-blend-screen"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-white line-clamp-1">{item.product?.name || "Luxury Watch Piece"}</h5>
                  <p className="text-xs text-white/50 mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.unit_price)}
                  </p>
                </div>
                <div className="text-right font-bold text-sm text-[#D4AF37]">
                  {formatPrice(item.quantity * item.unit_price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Footer */}
        <div className="bg-[#050506]/40 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
          <div>
            <span className="text-white/40 uppercase tracking-widest block text-[10px]">Deliver To:</span>
            <span className="text-white font-medium">
              {order.shipping_address?.firstName} {order.shipping_address?.lastName} ({order.shipping_address?.phone})
            </span>
            <span className="text-white/60 block">
              {order.shipping_address?.address}, {order.shipping_address?.city}
            </span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <div>
              <span className="text-white/40 uppercase tracking-widest block text-[10px]">Total Amount</span>
              <span className="text-base font-extrabold text-[#D4AF37]">{formatPrice(order.total_amount)}</span>
            </div>

            <a
              href={`https://wa.me/923000138707?text=Hi%20Orvano%20Team,%20I%20need%20an%20update%20for%20Order%20%23ORV-${shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050506] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
