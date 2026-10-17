"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { revalidateHomepage } from "@/app/actions/revalidate";

export default function AdminSettingsPage() {
  // Security State
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_title: "",
    account_number: "",
    iban: ""
  });
  const [bankLoading, setBankLoading] = useState(false);
  const [bankMessage, setBankMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Shipping Settings State
  const [shippingSettings, setShippingSettings] = useState({
    shipping_fee: "0",
    free_shipping_threshold: "0"
  });
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingMessage, setShippingMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Site Packaging Images & Descriptions State (Watch & Pants)
  const [siteImages, setSiteImages] = useState({
    watch_packaging_image: "",
    watch_packaging_desc: "",
    pants_packaging_image: "",
    pants_packaging_desc: ""
  });
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesMessage, setImagesMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Hero Carousel Slides State
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slidesMessage, setSlidesMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Popup Cards State (Min 0, Max 2)
  const [popupCards, setPopupCards] = useState<any[]>([]);
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Listed Products State for Quick Select
  const [productsList, setProductsList] = useState<any[]>([]);

  // Active Tab Classification State
  const [activeTab, setActiveTab] = useState<'carousel' | 'popups' | 'packaging' | 'shipping' | 'coupons' | 'security_bank' | 'all'>('carousel');

  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      // Fetch Store Products for Quick Selection
      const { data: prods } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (prods) {
        setProductsList(prods);
      }

      const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
      if (data) {
        setBankDetails({
          bank_name: data.bank_name || "",
          account_title: data.account_title || "",
          account_number: data.account_number || "",
          iban: data.iban || ""
        });
        setShippingSettings({
          shipping_fee: data.shipping_fee !== undefined && data.shipping_fee !== null ? String(data.shipping_fee) : "0",
          free_shipping_threshold: data.free_shipping_threshold !== undefined && data.free_shipping_threshold !== null ? String(data.free_shipping_threshold) : "0"
        });
        const pkgEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_packaging_images') : null;
        setSiteImages({
          watch_packaging_image: pkgEntry?.watch_packaging_image || data.watch_packaging_image || data.premium_box_image || "/images/box-watch.jpeg",
          watch_packaging_desc: pkgEntry?.watch_packaging_desc || "Every ORVANO timepiece is delivered in our custom velvet-lined matte black presentation box with shockproof foam protection and gold foil embossing.",
          pants_packaging_image: pkgEntry?.pants_packaging_image || data.pants_packaging_image || data.hero_pants_image || "/images/pants.png",
          pants_packaging_desc: pkgEntry?.pants_packaging_desc || "Our baggy cargo pants are packaged in custom heavy-duty seal bags with metallic gold hardware details and signature ORVANO collector card."
        });
        
        // Extract hero_slides from coupons array or direct column
        const heroEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_hero_slides') : null;
        const slides = heroEntry?.slides || data.hero_slides || [
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
        setHeroSlides(slides);

        // Extract popup_cards from coupons array or direct column
        const popupEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_popup_cards') : null;
        const popups = popupEntry?.popups || data.popup_cards || [];
        setPopupCards(popups);

        // Extract shipping_settings from coupons array or direct column
        const shippingEntry = Array.isArray(data.coupons) ? data.coupons.find((c: any) => c._type === '_shipping_settings') : null;
        const fee = shippingEntry?.shipping_fee ?? data.shipping_fee ?? 0;
        const thresh = shippingEntry?.free_shipping_threshold ?? data.free_shipping_threshold ?? 0;

        setShippingSettings({
          shipping_fee: String(fee),
          free_shipping_threshold: String(thresh)
        });

        // Filter out internal entries (_hero_slides, _popup_cards, _shipping_settings) from coupons state
        const cleanCoupons = Array.isArray(data.coupons) 
          ? data.coupons.filter((c: any) => c._type !== '_hero_slides' && c._type !== '_popup_cards' && c._type !== '_shipping_settings') 
          : [];
        setCoupons(cleanCoupons);
      }
    }
    fetchSettings();
  }, [supabase]);

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPin.length < 6) {
      setMessage({ text: "PIN must be at least 6 characters.", type: "error" });
      return;
    }

    if (newPin !== confirmPin) {
      setMessage({ text: "PINs do not match.", type: "error" });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("users")
        .update({ admin_pin: newPin })
        .eq("id", user.id);

      if (error) {
        setMessage({ text: "Failed to update PIN: " + error.message, type: "error" });
      } else {
        setMessage({ text: "Admin PIN updated successfully!", type: "success" });
        setNewPin("");
        setConfirmPin("");
      }
    }

    setLoading(false);
  };

  const handleUpdateBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankMessage(null);
    setBankLoading(true);

    const { error } = await supabase
      .from('store_settings')
      .update({
        bank_name: bankDetails.bank_name,
        account_title: bankDetails.account_title,
        account_number: bankDetails.account_number,
        iban: bankDetails.iban
      })
      .eq('id', 1);

    if (error) {
      setBankMessage({ text: "Failed to update Bank Details: " + error.message, type: "error" });
    } else {
      setBankMessage({ text: "Bank Details updated successfully!", type: "success" });
    }

    setBankLoading(false);
  };

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingMessage(null);
    setShippingLoading(true);

    const feeVal = parseFloat(shippingSettings.shipping_fee);
    const thresholdVal = parseFloat(shippingSettings.free_shipping_threshold);

    if (isNaN(feeVal) || feeVal < 0) {
      setShippingMessage({ text: "Shipping fee must be 0 or greater.", type: "error" });
      setShippingLoading(false);
      return;
    }

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];

    const updatedCoupons = [
      ...existingCoupons.filter((c: any) => c._type !== '_shipping_settings'),
      { _type: '_shipping_settings', shipping_fee: feeVal, free_shipping_threshold: isNaN(thresholdVal) ? 0 : thresholdVal }
    ];

    const { error } = await supabase
      .from('store_settings')
      .update({ coupons: updatedCoupons })
      .eq('id', 1);

    if (error) {
      setShippingMessage({ text: "Failed to update Shipping Fee: " + error.message, type: "error" });
    } else {
      setShippingMessage({ text: "Shipping Fee settings updated live on Checkout!", type: "success" });
    }

    setShippingLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof siteImages) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setImagesMessage(null);
    setImagesLoading(true);
    const file = e.target.files[0];

    // Upload image to local public/images folder
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('prefix', key);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      const imageUrl = data.url;
      const newImages = { ...siteImages, [key]: imageUrl };
      setSiteImages(newImages);

      // Save to db inside coupons JSON payload schema-safely
      const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
      const existingCoupons = currentData?.coupons || [];

      const updatedCoupons = [
        ...existingCoupons.filter((c: any) => c._type !== '_packaging_images'),
        { _type: '_packaging_images', ...newImages }
      ];

      const { error: updateError } = await supabase
        .from('store_settings')
        .update({ coupons: updatedCoupons })
        .eq('id', 1);

      if (updateError) {
        setImagesMessage({ text: "Error saving image URL to database: " + updateError.message, type: "error" });
      } else {
        setImagesMessage({ text: `${key === 'watch_packaging_image' ? 'Watch Packaging' : 'Pants Packaging'} image updated successfully!`, type: "success" });
      }
    } catch (err: any) {
      setImagesMessage({ text: "Error uploading image: " + err.message, type: "error" });
    } finally {
      setImagesLoading(false);
    }
  };

  const handleSavePackagingDetails = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setImagesMessage(null);
    setImagesLoading(true);

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];

    const updatedCoupons = [
      ...existingCoupons.filter((c: any) => c._type !== '_packaging_images'),
      { _type: '_packaging_images', ...siteImages }
    ];

    const { error } = await supabase
      .from('store_settings')
      .update({ coupons: updatedCoupons })
      .eq('id', 1);

    if (error) {
      setImagesMessage({ text: "Error saving packaging details: " + error.message, type: "error" });
    } else {
      setImagesMessage({ text: "Packaging photos & descriptions saved live for About page!", type: "success" });
    }

    setImagesLoading(false);
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMessage(null);
    if (!newCouponCode.trim() || !newCouponDiscount) return;

    const discountVal = parseInt(newCouponDiscount);
    if (isNaN(discountVal) || discountVal <= 0 || discountVal > 100) {
      setCouponMessage({ text: "Discount must be a percentage between 1 and 100.", type: "error" });
      return;
    }

    setCouponLoading(true);

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];
    const internalEntries = Array.isArray(existingCoupons) ? existingCoupons.filter((c: any) => c && c._type) : [];

    const updatedCoupons = [
      ...internalEntries,
      ...coupons.filter(c => c.code !== newCouponCode.trim().toUpperCase()),
      { code: newCouponCode.trim().toUpperCase(), discount: discountVal }
    ];

    const { error } = await supabase
      .from('store_settings')
      .update({ coupons: updatedCoupons })
      .eq('id', 1);

    if (error) {
      setCouponMessage({ text: "Failed to create coupon: " + error.message, type: "error" });
    } else {
      setCoupons(coupons.filter(c => c.code !== newCouponCode.trim().toUpperCase()).concat([{ code: newCouponCode.trim().toUpperCase(), discount: discountVal }]));
      setNewCouponCode("");
      setNewCouponDiscount("");
      setCouponMessage({ text: "Coupon created successfully!", type: "success" });
    }

    setCouponLoading(false);
  };

  const handleDeleteCoupon = async (codeToDelete: string) => {
    setCouponMessage(null);
    setCouponLoading(true);

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];
    const internalEntries = Array.isArray(existingCoupons) ? existingCoupons.filter((c: any) => c && c._type) : [];

    const cleanUserCoupons = coupons.filter(c => c.code !== codeToDelete);
    const updatedCoupons = [
      ...internalEntries,
      ...cleanUserCoupons
    ];

    const { error } = await supabase
      .from('store_settings')
      .update({ coupons: updatedCoupons })
      .eq('id', 1);

    if (error) {
      setCouponMessage({ text: "Failed to delete coupon: " + error.message, type: "error" });
    } else {
      setCoupons(cleanUserCoupons);
      setCouponMessage({ text: "Coupon deleted successfully!", type: "success" });
    }

    setCouponLoading(false);
  };

  const handleSlideChange = (index: number, field: string, value: string) => {
    const updated = [...heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlides(updated);
  };

  const handleSelectProductForSlide = (index: number, productId: string) => {
    const selectedProd = productsList.find(p => p.id === productId);
    if (!selectedProd) return;

    const nameParts = selectedProd.name.split(' ');
    const firstWord = nameParts[0] || selectedProd.name;
    const remainingWords = nameParts.slice(1).join(' ') || selectedProd.name;

    const updated = [...heroSlides];
    updated[index] = {
      ...updated[index],
      titleWhite: firstWord.toUpperCase(),
      titleGold: remainingWords.toUpperCase(),
      description1: selectedProd.description || `${selectedProd.category} Collection`,
      image: selectedProd.image_url || updated[index].image,
      link: `/product/${selectedProd.id}`
    };
    setHeroSlides(updated);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      badge: "NEW ARRIVAL",
      subtitle: "EXECUTIVE COLLECTION",
      titleWhite: "NEW",
      titleGold: "COLLECTION",
      description1: "Unmatched luxury craftsmanship.",
      description2: "Available now in limited quantities.",
      image: "/images/pants.png",
      link: "/shop"
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleDeleteSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      alert("At least 1 hero slide is required.");
      return;
    }
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated);
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSlidesMessage(null);
    setSlidesLoading(true);

    const file = e.target.files[0];
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('prefix', `hero_slide_${index}`);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      handleSlideChange(index, 'image', data.url);
      setSlidesMessage({ text: `Slide #${index + 1} image uploaded! Click 'Save All Carousel Slides' to publish.`, type: "success" });
    } catch (err: any) {
      setSlidesMessage({ text: "Error uploading slide image: " + err.message, type: "error" });
    } finally {
      setSlidesLoading(false);
    }
  };

  const handleSaveHeroSlides = async () => {
    setSlidesMessage(null);
    setSlidesLoading(true);

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];

    const updatedCoupons = [
      ...existingCoupons.filter((c: any) => c._type !== '_hero_slides'),
      { _type: '_hero_slides', slides: heroSlides }
    ];

    // Try updating hero_slides column first, and sync with coupons object
    const { error: directErr } = await supabase
      .from('store_settings')
      .update({ hero_slides: heroSlides, coupons: updatedCoupons })
      .eq('id', 1);

    if (directErr) {
      // Fallback if hero_slides column hasn't been created yet in Supabase
      const { error: fallbackErr } = await supabase
        .from('store_settings')
        .update({ coupons: updatedCoupons })
        .eq('id', 1);

      if (fallbackErr) {
        setSlidesMessage({ text: "Failed to save Hero Slides: " + fallbackErr.message, type: "error" });
      } else {
        await revalidateHomepage();
        setSlidesMessage({ text: "Hero Carousel Slides saved & updated live on Homepage!", type: "success" });
      }
    } else {
      await revalidateHomepage();
      setSlidesMessage({ text: "Hero Carousel Slides saved & updated live on Homepage!", type: "success" });
    }

    setSlidesLoading(false);
  };

  // Popup Cards Handlers (Max 2, Min 0)
  const handlePopupChange = (index: number, field: string, value: any) => {
    const updated = [...popupCards];
    updated[index] = { ...updated[index], [field]: value };
    setPopupCards(updated);
  };

  const handleSelectProductForPopup = (index: number, productId: string) => {
    if (!productId) return;
    const prod = productsList.find((p) => p.id === productId);
    if (!prod) return;

    const updated = [...popupCards];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      title: prod.name || updated[index].title,
      description: prod.description || `Explore special offer on ${prod.name}!`,
      image: prod.image_url || (prod.images && prod.images[0]) || updated[index].image,
      buttonLink: `/product/${prod.id}`,
      buttonText: `VIEW PRODUCT`,
      badge: prod.category ? prod.category.toUpperCase() : "FEATURED PRODUCT"
    };
    setPopupCards(updated);
  };

  const handleAddPopup = () => {
    if (popupCards.length >= 2) {
      setPopupMessage({ text: "Maximum 2 popup cards allowed.", type: 'error' });
      return;
    }
    const newPopup = {
      id: `popup-${Date.now()}`,
      badge: "SPECIAL PROMO",
      title: "EXCLUSIVE OFFER",
      description: "Get 15% OFF your next luxury order. Use code ORVANO15 at checkout!",
      buttonText: "SHOP COLLECTION",
      buttonLink: "/shop",
      image: "/images/box-watch.jpeg",
      enabled: true
    };
    setPopupCards([...popupCards, newPopup]);
    setPopupMessage(null);
  };

  const handleDeletePopup = (index: number) => {
    const updated = popupCards.filter((_, i) => i !== index);
    setPopupCards(updated);
    setPopupMessage(null);
  };

  const handlePopupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setPopupMessage(null);
    setPopupLoading(true);

    const file = e.target.files[0];
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('prefix', `popup_card_${index}`);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      handlePopupChange(index, 'image', data.url);
      setPopupMessage({ text: `Popup #${index + 1} image uploaded! Click 'Save All Popup Cards' to publish.`, type: "success" });
    } catch (err: any) {
      setPopupMessage({ text: "Error uploading popup image: " + err.message, type: "error" });
    } finally {
      setPopupLoading(false);
    }
  };

  const handleSavePopupCards = async () => {
    if (popupCards.length > 2) {
      setPopupMessage({ text: "Maximum 2 popup cards allowed.", type: 'error' });
      return;
    }
    setPopupMessage(null);
    setPopupLoading(true);

    const { data: currentData } = await supabase.from('store_settings').select('coupons').eq('id', 1).single();
    const existingCoupons = currentData?.coupons || [];

    const updatedCoupons = [
      ...existingCoupons.filter((c: any) => c._type !== '_popup_cards'),
      { _type: '_popup_cards', popups: popupCards }
    ];

    const { error: directErr } = await supabase
      .from('store_settings')
      .update({ popup_cards: popupCards, coupons: updatedCoupons })
      .eq('id', 1);

    if (directErr) {
      const { error: fallbackErr } = await supabase
        .from('store_settings')
        .update({ coupons: updatedCoupons })
        .eq('id', 1);

      if (fallbackErr) {
        setPopupMessage({ text: "Failed to save Popup Cards: " + fallbackErr.message, type: "error" });
      } else {
        await revalidateHomepage();
        setPopupMessage({ text: "Popup Cards saved & updated live on Homepage!", type: "success" });
      }
    } else {
      await revalidateHomepage();
      setPopupMessage({ text: "Popup Cards saved & updated live on Homepage!", type: "success" });
    }

    setPopupLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-white">
      {/* Page Title & Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#D4AF37]">
          Store Settings & Security Controls
        </h1>
        <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
          Configure 2FA Security PINs, Manual Checkout Bank Details, Hero Branding Images, and Discount Coupons
        </p>
      </div>

      {/* Classified Settings Tab Navigation Bar */}
      <div className="flex overflow-x-auto scrollbar-none pb-2 sm:pb-0 flex-nowrap sm:flex-wrap gap-2.5 bg-[#0D0D0F] p-3 rounded-2xl border border-white/10 shadow-xl -mx-2 px-2 sm:mx-0 sm:px-3">
        {[
          { id: 'carousel', label: 'Hero Carousel', icon: '🎠' },
          { id: 'popups', label: 'Spotlight Offers', icon: '✨' },
          { id: 'packaging', label: 'Packaging Photos', icon: '🎁' },
          { id: 'shipping', label: 'Shipping & Fees', icon: '🚚' },
          { id: 'coupons', label: 'Coupons & Promos', icon: '🏷️' },
          { id: 'security_bank', label: 'Security & Payments', icon: '🔐' },
          { id: 'all', label: 'All Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 sm:shrink sm:flex-1 min-w-[130px] px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all duration-300 ${
              activeTab === tab.id
                ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-[1.02]"
                : "border-white/10 bg-black/40 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Security & Bank Details Section */}
      {(activeTab === 'all' || activeTab === 'security_bank') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Security Settings Card */}
          <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              🔐 Admin 2FA Security PIN
            </h2>
            
            {message && (
              <div className={`p-4 rounded-xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">New Admin PIN</label>
                <input 
                  type="password" 
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  required
                  placeholder="Enter new 6-digit PIN"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Confirm New PIN</label>
                <input 
                  type="password" 
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  required
                  placeholder="Confirm new PIN"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md mt-2"
              >
                {loading ? "Updating..." : "Update Admin PIN"}
              </button>
            </form>
          </div>

          {/* Bank Details Card */}
          <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              🏦 Bank Details (Manual Checkout)
            </h2>
            
            {bankMessage && (
              <div className={`p-4 rounded-xl text-xs font-bold ${bankMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {bankMessage.text}
              </div>
            )}

            <form onSubmit={handleUpdateBankDetails} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Bank Name</label>
                <input 
                  type="text" 
                  value={bankDetails.bank_name}
                  onChange={(e) => setBankDetails({...bankDetails, bank_name: e.target.value})}
                  required
                  placeholder="e.g. Meezan Bank / HBL"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Account Title</label>
                <input 
                  type="text" 
                  value={bankDetails.account_title}
                  onChange={(e) => setBankDetails({...bankDetails, account_title: e.target.value})}
                  required
                  placeholder="e.g. Orvano Official"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Account Number</label>
                <input 
                  type="text" 
                  value={bankDetails.account_number}
                  onChange={(e) => setBankDetails({...bankDetails, account_number: e.target.value})}
                  required
                  placeholder="e.g. 0102-0103-9999-01"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">IBAN (Optional)</label>
                <input 
                  type="text" 
                  value={bankDetails.iban}
                  onChange={(e) => setBankDetails({...bankDetails, iban: e.target.value})}
                  placeholder="e.g. PK36 MEZN 0001 0203 9999 01"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                disabled={bankLoading} 
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md mt-2"
              >
                {bankLoading ? "Saving..." : "Save Bank Details"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shipping Fee Settings Section */}
      {(activeTab === 'all' || activeTab === 'shipping') && (
        <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
            🚚 Store Shipping Fee Settings
          </h2>
          
          {shippingMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold ${shippingMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {shippingMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdateShipping} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">
                Standard Shipping Fee (PKR)
              </label>
              <input 
                type="number" 
                min="0"
                value={shippingSettings.shipping_fee}
                onChange={(e) => setShippingSettings({...shippingSettings, shipping_fee: e.target.value})}
                required
                placeholder="e.g. 200 (Enter 0 for Free Shipping)"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors font-semibold text-[#D4AF37]"
              />
              <p className="text-[10px] text-white/40">Enter 0 to offer free shipping on all orders.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">
                Free Shipping Order Threshold (PKR)
              </label>
              <input 
                type="number" 
                min="0"
                value={shippingSettings.free_shipping_threshold}
                onChange={(e) => setShippingSettings({...shippingSettings, free_shipping_threshold: e.target.value})}
                placeholder="e.g. 5000 (Free shipping on orders above PKR 5,000)"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
              />
              <p className="text-[10px] text-white/40">Orders above this amount get free shipping automatically (0 to disable threshold).</p>
            </div>

            <button 
              type="submit" 
              disabled={shippingLoading} 
              className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md mt-2"
            >
              {shippingLoading ? "Saving..." : "Save Shipping Settings"}
            </button>
          </form>
        </div>
      )}

      {/* Site Packaging Images & Details Management (Watch & Pants) */}
      {(activeTab === 'all' || activeTab === 'packaging') && (
        <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 flex items-center justify-between">
            <span>📦 Site Packaging Showcase & Descriptions</span>
            <span className="text-xs font-normal text-white/40 font-mono">2 PACKAGING CARDS FOR ABOUT PAGE</span>
          </h2>
          
          {imagesMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold ${imagesMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {imagesMessage.text}
            </div>
          )}

          <form onSubmit={handleSavePackagingDetails} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Watch Packaging Image & Description */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#050506] border border-white/10 hover:border-[#D4AF37]/30 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                      ⌚ Watch Packaging Box
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">1 OF 2</span>
                  </div>
                  
                  <div className="relative w-full aspect-square bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-3">
                    <Image 
                      src={siteImages.watch_packaging_image || "/images/box-watch.jpeg"} 
                      alt="Watch Packaging Box" 
                      fill 
                      sizes="400px" 
                      className="object-contain p-2" 
                    />
                  </div>

                  <label className="block text-center cursor-pointer bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-2.5 rounded-xl transition-all shadow-md group">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors">
                      {imagesLoading ? "Uploading..." : "Change Watch Photo"}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'watch_packaging_image')} disabled={imagesLoading} />
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Watch Packaging Description (About Page)
                  </label>
                  <textarea 
                    rows={3}
                    value={siteImages.watch_packaging_desc}
                    onChange={(e) => setSiteImages({ ...siteImages, watch_packaging_desc: e.target.value })}
                    placeholder="Describe Watch packaging features (e.g. Velvet lining, Gold embossed box)..."
                    className="w-full bg-[#09090B] border border-white/10 focus:border-[#D4AF37] p-3 text-xs rounded-xl text-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Pants Packaging Image & Description */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#050506] border border-white/10 hover:border-[#D4AF37]/30 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                      👖 Pants Packaging Bag/Box
                    </label>
                    <span className="text-[10px] text-white/40 font-mono">2 OF 2</span>
                  </div>
                  
                  <div className="relative w-full aspect-square bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-3">
                    <Image 
                      src={siteImages.pants_packaging_image || "/images/pants.png"} 
                      alt="Pants Packaging" 
                      fill 
                      sizes="400px" 
                      className="object-contain p-2" 
                    />
                  </div>

                  <label className="block text-center cursor-pointer bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-2.5 rounded-xl transition-all shadow-md group">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors">
                      {imagesLoading ? "Uploading..." : "Change Pants Photo"}
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'pants_packaging_image')} disabled={imagesLoading} />
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Pants Packaging Description (About Page)
                  </label>
                  <textarea 
                    rows={3}
                    value={siteImages.pants_packaging_desc}
                    onChange={(e) => setSiteImages({ ...siteImages, pants_packaging_desc: e.target.value })}
                    placeholder="Describe Pants packaging features (e.g. Custom heavy seal bag, Metallic zipper)..."
                    className="w-full bg-[#09090B] border border-white/10 focus:border-[#D4AF37] p-3 text-xs rounded-xl text-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={imagesLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg"
            >
              {imagesLoading ? "Saving Details..." : "Save Packaging Photos & Descriptions Live"}
            </button>
          </form>
        </div>
      )}

      {/* Coupon Codes Section */}
      {(activeTab === 'all' || activeTab === 'coupons') && (
        <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
            🏷️ Promotional Coupon Codes
          </h2>
          
          {couponMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold ${couponMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {couponMessage.text}
            </div>
          )}

          <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Coupon Code</label>
              <input 
                type="text" 
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                required
                placeholder="e.g. ORVANO20"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors uppercase font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Discount Percentage (%)</label>
              <input 
                type="number" 
                min="1"
                max="100"
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(e.target.value)}
                required
                placeholder="e.g. 20"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={couponLoading} 
                className="w-full bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-md"
              >
                {couponLoading ? "Adding..." : "Add Coupon"}
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-extrabold text-white/50 uppercase tracking-widest">Active Coupon Codes</h3>
            {coupons.length === 0 ? (
              <p className="text-xs text-white/40 italic">No active coupon codes created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coupons.map((coupon) => (
                  <div key={coupon.code} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <span className="font-mono bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2.5 py-1 rounded text-xs font-extrabold mr-2">
                        {coupon.code}
                      </span>
                      <span className="text-xs text-emerald-400 font-extrabold">{coupon.discount}% OFF</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      disabled={couponLoading}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Carousel Slide Manager Section */}
      {(activeTab === 'all' || activeTab === 'carousel') && (
        <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37]">
                🎠 Homepage Hero Carousel Manager
              </h2>
              <p className="text-white/50 text-xs mt-0.5">
                Add, edit, reorder, or delete slides shown on the top homepage slider
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddSlide}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>+ Add New Slide</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHeroSlides}
                disabled={slidesLoading}
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                {slidesLoading ? "Saving..." : "Save All Slides"}
              </button>
            </div>
          </div>

          {slidesMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold ${slidesMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {slidesMessage.text}
            </div>
          )}

          <div className="space-y-6">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id || idx} className="p-5 rounded-2xl bg-[#050506] border border-white/10 space-y-4 relative group">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-mono font-extrabold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      Carousel Slide #{idx + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(idx)}
                    className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded hover:bg-red-500/10 transition-all"
                  >
                    Delete Slide
                  </button>
                </div>

                {/* Quick Select Listed Product */}
                <div className="bg-[#09090C] border border-[#D4AF37]/30 p-3 rounded-xl space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                    <span>⚡ Quick Fill Slide from Store Product Inventory</span>
                  </label>
                  <select
                    onChange={(e) => handleSelectProductForSlide(idx, e.target.value)}
                    defaultValue=""
                    className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                  >
                    <option value="" disabled>-- Select Listed Product to Auto-Fill Image, Title &amp; Link --</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category}) - PKR {p.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Badge Tag Header</label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      onChange={(e) => handleSlideChange(idx, 'badge', e.target.value)}
                      placeholder="e.g. LIMITED EDITION DROP"
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Subtitle Category</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                      placeholder="e.g. URBAN HOROLOGY &amp; STREETWEAR"
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Headline Part 1 (White Text)</label>
                    <input
                      type="text"
                      value={slide.titleWhite || ''}
                      onChange={(e) => handleSlideChange(idx, 'titleWhite', e.target.value)}
                      placeholder="e.g. BAGGY FIT"
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none uppercase font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">Headline Part 2 (Gold Accent)</label>
                    <input
                      type="text"
                      value={slide.titleGold || ''}
                      onChange={(e) => handleSlideChange(idx, 'titleGold', e.target.value)}
                      placeholder="e.g. CARGO PANTS"
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-[#D4AF37] outline-none uppercase font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Description Line 1</label>
                    <input
                      type="text"
                      value={slide.description1 || ''}
                      onChange={(e) => handleSlideChange(idx, 'description1', e.target.value)}
                      placeholder="e.g. Tailored with heavyweight 480GSM Japanese cotton-twill."
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Description Line 2</label>
                    <input
                      type="text"
                      value={slide.description2 || ''}
                      onChange={(e) => handleSlideChange(idx, 'description2', e.target.value)}
                      placeholder="e.g. Engineered volume and liquid drape motion."
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Button Target Link URL</label>
                    <input
                      type="text"
                      value={slide.link || ''}
                      onChange={(e) => handleSlideChange(idx, 'link', e.target.value)}
                      placeholder="e.g. /pants or /watches"
                      className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-[#D4AF37] font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Slide Background Image</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={slide.image || ''}
                        onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                        placeholder="e.g. /images/pants.png or upload"
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none font-mono"
                      />
                      <label className="cursor-pointer bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 px-3 py-2 rounded-xl transition-all flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSlideImageUpload(e, idx)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homepage Spotlight Popup Cards Section (Max 2, Min 0) */}
      {(activeTab === 'all' || activeTab === 'popups') && (
        <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  🎴 Homepage Spotlight Popup Cards Manager
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
                  {popupCards.length}/2 Popups
                </span>
              </div>
              <p className="text-white/50 text-xs mt-0.5">
                Manage promotional pop-up cards shown as modal popups to website visitors (Maximum 2, Minimum 0).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddPopup}
                disabled={popupCards.length >= 2}
                className={`font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  popupCards.length >= 2 
                    ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                <span>+ Add Popup Card</span>
              </button>

              <button
                type="button"
                onClick={handleSavePopupCards}
                disabled={popupLoading}
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                {popupLoading ? "Saving..." : "Save All Popup Cards"}
              </button>
            </div>
          </div>

          {popupMessage && (
            <div className={`p-4 rounded-xl text-xs font-bold ${popupMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {popupMessage.text}
            </div>
          )}

          {popupCards.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-[#050506]">
              <p className="text-sm font-semibold text-white/60">No popup cards active right now.</p>
              <p className="text-xs text-white/40 mt-1">Click &quot;+ Add Popup Card&quot; above to create up to 2 popups for store visitors.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {popupCards.map((popup, idx) => (
                <div key={popup.id || idx} className="p-5 rounded-2xl bg-[#050506] border border-white/10 space-y-4 relative group">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-mono font-extrabold flex items-center justify-center">
                        0{idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white">
                        Popup Card #{idx + 1}
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={popup.enabled !== false}
                          onChange={(e) => handlePopupChange(idx, 'enabled', e.target.checked)}
                          className="accent-[#D4AF37] w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-xs text-white/70 font-semibold">
                          {popup.enabled !== false ? 'Active (Live)' : 'Disabled'}
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePopup(idx)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded hover:bg-red-500/10 transition-all"
                    >
                      Delete Popup
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quick Select from Listed Store Products */}
                    <div className="space-y-2 md:col-span-2 p-3 bg-[#0D0D0F] border border-[#D4AF37]/30 rounded-xl">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                        <span>📦 Quick Select Listed Product</span>
                        <span className="text-[9px] text-white/50 lowercase font-normal">(auto-fills image, title, category &amp; link)</span>
                      </label>
                      <select
                        value={popup.productId || ''}
                        onChange={(e) => handleSelectProductForPopup(idx, e.target.value)}
                        className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none font-semibold cursor-pointer"
                      >
                        <option value="">-- Select a Listed Product to Auto-Fill --</option>
                        {productsList.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.name} ({prod.category || 'General'}) - PKR {prod.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Badge Tag Header</label>
                      <input
                        type="text"
                        value={popup.badge || ''}
                        onChange={(e) => handlePopupChange(idx, 'badge', e.target.value)}
                        placeholder="e.g. SPECIAL OFFER"
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">Main Title Headline</label>
                      <input
                        type="text"
                        value={popup.title || ''}
                        onChange={(e) => handlePopupChange(idx, 'title', e.target.value)}
                        placeholder="e.g. EXCLUSIVE DISCOUNT"
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-[#D4AF37] outline-none uppercase font-bold"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Description Content</label>
                      <textarea
                        value={popup.description || ''}
                        onChange={(e) => handlePopupChange(idx, 'description', e.target.value)}
                        rows={2}
                        placeholder="e.g. Get 15% OFF on all watches and apparel today with code ORVANO15."
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Button Label Text</label>
                      <input
                        type="text"
                        value={popup.buttonText || ''}
                        onChange={(e) => handlePopupChange(idx, 'buttonText', e.target.value)}
                        placeholder="e.g. CLAIM OFFER / SHOP NOW"
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Button Target URL</label>
                      <input
                        type="text"
                        value={popup.buttonLink || ''}
                        onChange={(e) => handlePopupChange(idx, 'buttonLink', e.target.value)}
                        placeholder="e.g. /shop or /pants"
                        className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-[#D4AF37] font-mono outline-none"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">Popup Card Image</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={popup.image || ''}
                          onChange={(e) => handlePopupChange(idx, 'image', e.target.value)}
                          placeholder="e.g. /images/box-watch.jpeg or upload"
                          className="w-full bg-[#0D0D0F] border border-white/10 focus:border-[#D4AF37] px-3 py-2 text-xs rounded-xl text-white outline-none font-mono"
                        />
                        <label className="cursor-pointer bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 px-3 py-2 rounded-xl transition-all flex-shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePopupImageUpload(e, idx)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
