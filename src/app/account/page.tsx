"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Package,
  MapPin,
  Settings,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Copy,
  AlertCircle,
  RefreshCw,
  Wifi
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useCurrencyStore } from "@/store/currencyStore";

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Address Form State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  // Track Parcel Tab Search State
  const [trackQuery, setTrackQuery] = useState("");
  const [trackUnderProcessing, setTrackUnderProcessing] = useState<any[]>([]);
  const [trackDelivered, setTrackDelivered] = useState<any[]>([]);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);

  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  const router = useRouter();
  const supabase = createClient();

  const DELIVERED_STATUSES = ["delivered", "completed", "cancelled", "returned"];

  const fetchOrders = useCallback(async (userId: string, isSilent = false, userEmail = "") => {
    if (!isSilent) setLoadingOrders(true);
    else setIsLiveSyncing(true);

    try {
      const emailParam = userEmail || user?.email || "";
      // 1. Direct MySQL Fetch via /api/orders
      const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(emailParam)}`);
      const apiData = await res.json();
      
      if (apiData.success && Array.isArray(apiData.orders) && apiData.orders.length > 0) {
        setOrders(apiData.orders);
        const under = apiData.orders.filter((o: any) => !DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));
        const deliv = apiData.orders.filter((o: any) => DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));
        setTrackUnderProcessing(under);
        setTrackDelivered(deliv);
        setLastSyncedTime(new Date().toLocaleTimeString());
        return;
      }

      // 2. Supabase Fallback Fetch
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
        const under = data.filter((o) => !DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));
        const deliv = data.filter((o) => DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));
        setTrackUnderProcessing(under);
        setTrackDelivered(deliv);
        setLastSyncedTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      if (!isSilent) setLoadingOrders(false);
      else setTimeout(() => setIsLiveSyncing(false), 800);
    }
  }, [supabase]);

  useEffect(() => {
    let intervalId: any;
    let channel: any;

    const getUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);

        // Fetch User Profile
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          if (profileData.address) {
            setAddressForm(profileData.address);
          }
          if (profileData.phone || profileData.address?.phone) {
            setTrackQuery(profileData.phone || profileData.address?.phone);
          }
        }

        // Initial orders load
        await fetchOrders(session.user.id, false, session.user.email || "");

        // LIVE REALTIME SUBSCRIPTION on orders table for this user
        channel = supabase
          .channel(`account_orders_${session.user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "orders",
              filter: `user_id=eq.${session.user.id}`
            },
            () => {
              fetchOrders(session.user.id, true, session.user.email || "");
            }
          )
          .subscribe();

        // Interval background poll every 6 seconds as backup
        intervalId = setInterval(() => {
          fetchOrders(session.user.id, true, session.user.email || "");
        }, 6000);
      }
    };

    getUserAndOrders();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (channel) supabase.removeChannel(channel);
    };
  }, [router, supabase, fetchOrders]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    const { error } = await supabase
      .from("users")
      .update({ address: addressForm })
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, address: addressForm });
      setIsEditingAddress(false);
    }
    setSavingAddress(false);
  };

  const handleAccountTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setIsSearchingTrack(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trackQuery })
      });
      const data = await res.json();
      if (data.success) {
        setTrackUnderProcessing(data.underProcessing || []);
        setTrackDelivered(data.delivered || []);
      }
    } catch (err) {
      console.error("Track search error:", err);
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const underProcessingOrders = orders.filter((o) => !DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));
  const deliveredOrders = orders.filter((o) => DELIVERED_STATUSES.includes((o.status || "").toLowerCase()));

  const getStatusStep = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") return 4;
    if (s === "shipped" || s === "in_transit" || s === "dispatched") return 3;
    if (s === "paid" || s === "processing") return 2;
    return 1;
  };

  if (!user) return <main className="min-h-screen bg-background" />;

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground pt-20">
      <Navbar />

      {/* Page Header */}
      <section className="bg-background border-b border-foreground/10 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-heading text-foreground uppercase tracking-wider mb-2"
            >
              My Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground/60 tracking-wide flex items-center gap-2"
            >
              Welcome back,{" "}
              <span className="text-[#D4AF37] font-semibold">
                {user.user_metadata?.first_name || user.email?.split("@")[0] || "User"}
              </span>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE SYNC
              </span>
            </motion.p>
          </div>

          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {profile?.is_admin && (
              <Button
                onClick={() => router.push("/admin")}
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-bold uppercase tracking-widest text-xs py-3 px-5 rounded-lg flex items-center shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" /> Admin Panel
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="opacity-60 hover:opacity-100 flex items-center text-xs uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </section>

      {/* Account Main Content */}
      <section className="flex-1 container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/4">
            <div className="bg-surface border border-foreground/10 p-4 rounded-2xl space-y-2 sticky top-32">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                  activeTab === "orders"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-l-4 border-[#D4AF37]"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5 border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-3" /> Order History
                </div>
                {underProcessingOrders.length > 0 && (
                  <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {underProcessingOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("track")}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                  activeTab === "track"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-l-4 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5 border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-3 text-[#D4AF37]" /> Track Parcel
                </div>
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" /> LIVE
                </span>
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                  activeTab === "addresses"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-l-4 border-[#D4AF37]"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5 border-l-4 border-transparent"
                }`}
              >
                <MapPin className="w-4 h-4 mr-3" /> Addresses
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center px-4 py-3.5 text-xs font-bold tracking-widest uppercase rounded-xl transition-all ${
                  activeTab === "settings"
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-l-4 border-[#D4AF37]"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/5 border-l-4 border-transparent"
                }`}
              >
                <Settings className="w-4 h-4 mr-3" /> Account Settings
              </button>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              {/* TAB 1: ORDER HISTORY */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-foreground/10 rounded-2xl p-6 md:p-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-foreground/10 pb-6 mb-8 gap-4">
                    <div>
                      <h3 className="text-xl font-heading text-foreground uppercase tracking-widest">
                        Order History
                      </h3>
                      <p className="text-xs text-foreground/50 mt-1">
                        Active under-processing orders are separated from past completed orders.
                      </p>
                    </div>

                    <Button
                      onClick={() => setActiveTab("track")}
                      className="bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" /> Live Track Parcel
                    </Button>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-12 text-foreground/50 animate-pulse">
                      Loading your order history...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-foreground/50 border border-foreground/10 border-dashed rounded-2xl">
                      <Package className="w-10 h-10 mx-auto mb-3 text-[#D4AF37]/40" />
                      <p className="font-semibold text-foreground">You haven't placed any orders yet.</p>
                      <Button onClick={() => router.push("/shop")} className="mt-4 text-xs">
                        Browse Luxury Collection
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Section 1: Under Processing Orders */}
                      <div className="space-y-6">
                        <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Under Processing / Active Orders ({underProcessingOrders.length})
                        </h4>

                        {underProcessingOrders.length === 0 ? (
                          <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-xl text-center text-xs text-foreground/50">
                            No active orders currently under processing.
                          </div>
                        ) : (
                          underProcessingOrders.map((order) => (
                            <OrderSummaryCard
                              key={order.id}
                              order={order}
                              formatPrice={formatPrice}
                              onTrack={() => setActiveTab("track")}
                              isActive
                            />
                          ))
                        )}
                      </div>

                      {/* Section 2: Delivered & Past Orders */}
                      <div className="space-y-6 pt-6 border-t border-foreground/10">
                        <h4 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Delivered & Past Orders ({deliveredOrders.length})
                        </h4>

                        {deliveredOrders.length === 0 ? (
                          <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-xl text-center text-xs text-foreground/50">
                            No past delivered orders.
                          </div>
                        ) : (
                          deliveredOrders.map((order) => (
                            <OrderSummaryCard
                              key={order.id}
                              order={order}
                              formatPrice={formatPrice}
                              onTrack={() => setActiveTab("track")}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: TRACK PARCEL */}
              {activeTab === "track" && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-foreground/10 rounded-2xl p-6 md:p-8 space-y-8"
                >
                  <div className="border-b border-foreground/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-heading text-foreground uppercase tracking-widest flex items-center gap-2">
                          <Truck className="w-6 h-6 text-[#D4AF37]" /> Track Parcel Dashboard
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE UPDATES
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60 mt-1">
                        Real-time courier progress for your under-processing & dispatched parcels.
                        {lastSyncedTime && <span className="text-foreground/40 font-mono ml-2">(Last sync: {lastSyncedTime})</span>}
                      </p>
                    </div>

                    {/* Quick Phone Search Form */}
                    <form onSubmit={handleAccountTrackSearch} className="flex gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={trackQuery}
                          onChange={(e) => setTrackQuery(e.target.value)}
                          placeholder="Phone # or Order ID"
                          className="bg-background border border-foreground/15 px-3 py-2 text-xs rounded-xl text-foreground focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <Button type="submit" disabled={isSearchingTrack} size="sm" className="text-xs py-2 px-4 rounded-xl">
                        {isSearchingTrack ? "..." : <Search className="w-3.5 h-3.5" />}
                      </Button>
                    </form>
                  </div>

                  {/* Under Processing Section */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center justify-between">
                      <span>🚚 Active Under-Processing Parcels ({trackUnderProcessing.length})</span>
                      <button
                        onClick={() => user?.id && fetchOrders(user.id, true)}
                        disabled={isLiveSyncing}
                        className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLiveSyncing ? "animate-spin" : ""}`} />
                        {isLiveSyncing ? "Syncing..." : "Sync Now"}
                      </button>
                    </h4>

                    {trackUnderProcessing.length === 0 ? (
                      <div className="p-8 bg-background border border-foreground/10 rounded-2xl text-center">
                        <Clock className="w-10 h-10 mx-auto text-[#D4AF37]/40 mb-3" />
                        <p className="font-semibold text-foreground text-sm">No Active Orders Under Processing</p>
                        <p className="text-xs text-foreground/50 mt-1">
                          You do not have any active parcels in transit right now.
                        </p>
                      </div>
                    ) : (
                      trackUnderProcessing.map((order) => (
                        <AccountTrackCard
                          key={order.id}
                          order={order}
                          formatPrice={formatPrice}
                          copyToClipboard={copyToClipboard}
                          copiedId={copiedId}
                          getStatusStep={getStatusStep}
                        />
                      ))
                    )}
                  </div>

                  {/* Delivered Section */}
                  {trackDelivered.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-foreground/10">
                      <h4 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400">
                        ✓ Delivered Parcels ({trackDelivered.length})
                      </h4>

                      {trackDelivered.map((order) => (
                        <AccountTrackCard
                          key={order.id}
                          order={order}
                          formatPrice={formatPrice}
                          copyToClipboard={copyToClipboard}
                          copiedId={copiedId}
                          getStatusStep={getStatusStep}
                          isDelivered
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: ADDRESSES */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-foreground/10 rounded-2xl p-6 md:p-8"
                >
                  <div className="flex justify-between items-center border-b border-foreground/10 pb-4 mb-8">
                    <h3 className="text-xl font-heading text-foreground uppercase tracking-widest">
                      Saved Addresses
                    </h3>
                    {!isEditingAddress && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditingAddress(true)}>
                        {profile?.address ? "Edit Address" : "Add Address"}
                      </Button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-6 max-w-lg">
                      <div className="space-y-2">
                        <label className="text-foreground/60 text-xs tracking-widest uppercase block">Street Address</label>
                        <input required type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-foreground/60 text-xs tracking-widest uppercase block">City</label>
                          <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-foreground/60 text-xs tracking-widest uppercase block">State/Province</label>
                          <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-foreground/60 text-xs tracking-widest uppercase block">ZIP Code</label>
                          <input required type="text" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-foreground/60 text-xs tracking-widest uppercase block">Country</label>
                          <input required type="text" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button type="submit" disabled={savingAddress}>
                          {savingAddress ? "Saving..." : "Save Address"}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile?.address ? (
                        <div className="border border-[#D4AF37]/30 p-6 relative rounded-xl">
                          <span className="absolute top-4 right-4 bg-[#D4AF37] text-black text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md">Default</span>
                          <h4 className="text-foreground font-medium mb-2 uppercase tracking-wide">Primary Delivery Address</h4>
                          <p className="text-foreground/60 font-light text-sm leading-relaxed mb-4">
                            {profile.first_name} {profile.last_name}<br />
                            {profile.address.street}<br />
                            {profile.address.city}, {profile.address.state} {profile.address.zip}<br />
                            {profile.address.country}
                          </p>
                        </div>
                      ) : (
                        <div className="border border-foreground/10 border-dashed p-6 text-center text-foreground/50 rounded-xl">
                          No saved delivery address found.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-surface border border-foreground/10 rounded-2xl p-6 md:p-8"
                >
                  <h3 className="text-xl font-heading text-foreground uppercase tracking-widest mb-8 border-b border-foreground/10 pb-4">
                    Account Details
                  </h3>

                  <form className="space-y-6 max-w-lg">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-foreground/60 text-xs tracking-widest uppercase block">First Name</label>
                        <input type="text" defaultValue={user.user_metadata?.first_name || ""} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-foreground/60 text-xs tracking-widest uppercase block">Last Name</label>
                        <input type="text" defaultValue={user.user_metadata?.last_name || ""} className="w-full bg-background border border-foreground/10 px-4 py-3 text-foreground rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-foreground/60 text-xs tracking-widest uppercase block">Email Address</label>
                      <input type="email" readOnly defaultValue={user.email} className="w-full bg-background/50 border border-foreground/10 px-4 py-3 text-foreground/70 rounded-xl cursor-not-allowed" />
                    </div>

                    <Button type="button" className="mt-4">Save Changes</Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function OrderSummaryCard({
  order,
  formatPrice,
  onTrack,
  isActive = false
}: {
  order: any;
  formatPrice: (amt: number) => string;
  onTrack: () => void;
  isActive?: boolean;
}) {
  const shortId = (order.id || "").split("-")[0].toUpperCase();

  return (
    <div className={`border p-6 rounded-2xl transition-all ${
      isActive ? "border-[#D4AF37]/40 bg-[#D4AF37]/5" : "border-foreground/10 bg-surface"
    }`}>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-foreground/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-foreground/50 text-xs tracking-widest uppercase">Order #ORV-{shortId}</span>
            {isActive && (
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Under Processing
              </span>
            )}
          </div>
          <p className="text-foreground font-medium text-xs mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left md:text-right">
            <p className="text-foreground/50 text-[10px] tracking-widest uppercase">Status</p>
            <p className={`text-xs font-bold tracking-wider capitalize ${
              order.status === "delivered" ? "text-emerald-400" : "text-[#D4AF37]"
            }`}>
              {order.status.replace("_", " ")}
            </p>
          </div>

          <button
            onClick={onTrack}
            className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
          >
            <Truck className="w-3.5 h-3.5" /> Track
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="w-14 h-14 bg-foreground/5 border border-foreground/10 p-1 rounded-lg flex items-center justify-center shrink-0">
              <img
                src={item.product?.image_url || "/images/watch.png"}
                alt={item.product?.name}
                className="max-w-full max-h-full mix-blend-screen object-contain"
              />
            </div>
            <div className="flex-1">
              <h5 className="text-foreground font-medium text-xs line-clamp-1">{item.product?.name || "Luxury Item"}</h5>
              <p className="text-foreground/50 text-[11px] mt-0.5">Qty: {item.quantity}</p>
            </div>
            <div className="text-right text-xs font-bold text-foreground">
              {formatPrice(item.unit_price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-foreground/10 flex justify-between items-center text-xs">
        <span className="uppercase tracking-widest font-bold text-foreground/60">Total Paid</span>
        <span className="text-[#D4AF37] font-bold text-sm">{formatPrice(order.total_amount)}</span>
      </div>
    </div>
  );
}

function AccountTrackCard({
  order,
  formatPrice,
  copyToClipboard,
  copiedId,
  getStatusStep,
  isDelivered = false
}: {
  order: any;
  formatPrice: (amt: number) => string;
  copyToClipboard: (str: string) => void;
  copiedId: string | null;
  getStatusStep: (status: string) => number;
  isDelivered?: boolean;
}) {
  const shortId = (order.id || "").split("-")[0].toUpperCase();
  const currentStep = getStatusStep(order.status);
  const orderDate = new Date(order.created_at || Date.now());
  const estDelivery = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isDelivered ? "bg-background/60 border-foreground/10" : "bg-background border-[#D4AF37]/30 shadow-xl"
    }`}>
      <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 mb-6 border-b border-foreground/10 gap-3">
        <div>
          <span className="text-xs text-foreground/50 font-mono">Order #ORV-{shortId}</span>
          <p className="text-xs font-bold text-foreground mt-0.5">
            Placed {orderDate.toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
            isDelivered
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40"
          }`}>
            {order.status.replace("_", " ")}
          </span>

          <button
            onClick={() => copyToClipboard(`ORV-${shortId}`)}
            className="text-foreground/40 hover:text-[#D4AF37] text-xs transition-colors"
          >
            {copiedId === `ORV-${shortId}` ? "Copied!" : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive Progress Timeline */}
      <div className="bg-surface/50 p-4 rounded-xl border border-foreground/10 mb-6">
        <div className="flex justify-between text-[11px] text-foreground/60 mb-4 uppercase tracking-wider">
          <span>Courier Delivery Timeline</span>
          <span>Est. Delivery: <strong className="text-[#D4AF37]">{estDelivery.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong></span>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-foreground/10 z-0" />
          <motion.div
            className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-[#D4AF37] z-0 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
            initial={false}
            animate={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "33%" : currentStep === 3 ? "66%" : "100%"
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex justify-between text-[10px] text-center font-bold">
            <div>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border-2 border-background ${
                currentStep >= 1 ? "bg-[#D4AF37] text-black" : "bg-foreground/10 text-foreground/40"
              }`}>
                ✓
              </div>
              <span className="mt-1 block uppercase">Placed</span>
            </div>

            <div>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border-2 border-background ${
                currentStep >= 2 ? "bg-[#D4AF37] text-black" : "bg-foreground/10 text-foreground/40"
              }`}>
                {currentStep >= 2 ? "✓" : "2"}
              </div>
              <span className="mt-1 block uppercase">Confirmed</span>
            </div>

            <div>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border-2 border-background ${
                currentStep >= 3 ? "bg-[#D4AF37] text-black" : "bg-foreground/10 text-foreground/40"
              }`}>
                {currentStep >= 3 ? <Truck className="w-3.5 h-3.5 text-black animate-pulse" /> : "3"}
              </div>
              <span className="mt-1 block uppercase text-[#D4AF37]">In Transit</span>
            </div>

            <div>
              <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center border-2 border-background ${
                currentStep === 4 ? "bg-emerald-500 text-black" : "bg-foreground/10 text-foreground/40"
              }`}>
                {currentStep === 4 ? "✓" : "4"}
              </div>
              <span className="mt-1 block uppercase">Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="flex justify-between items-center text-xs pt-2">
        <div className="text-foreground/60">
          Items: <span className="text-foreground font-bold">{order.order_items?.length || 0} product(s)</span>
        </div>
        <div className="font-extrabold text-[#D4AF37] text-sm">
          Total: {formatPrice(order.total_amount)}
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
