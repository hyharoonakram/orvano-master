"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrencyStore } from "@/store/currencyStore";

export function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [isEditing, setIsEditing] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    category: "Watches",
    image_url: "",
    images: [] as string[],
    stock_quantity: "10",
    glow_color: "rgba(35, 95, 175, 0.55)",
    display_order: "1"
  });

  const categories = ["All", "Men's Watches", "Women's Watches", "Watches", "Pants", "T-Shirts", "Hoodies", "Accessories"];

  const glowColorPresets = [
    { name: "Ocean Blue", color: "rgba(35, 95, 175, 0.55)", bg: "bg-blue-600" },
    { name: "Emerald Green", color: "rgba(16, 125, 75, 0.65)", bg: "bg-emerald-600" },
    { name: "Ruby Red", color: "rgba(175, 30, 50, 0.65)", bg: "bg-red-600" },
    { name: "Warm Gold", color: "rgba(195, 145, 35, 0.65)", bg: "bg-amber-500" },
    { name: "Rose Gold", color: "rgba(185, 80, 115, 0.65)", bg: "bg-pink-600" },
    { name: "Onyx Black", color: "rgba(75, 85, 105, 0.60)", bg: "bg-slate-700" },
    { name: "Platinum Ice", color: "rgba(70, 125, 185, 0.50)", bg: "bg-cyan-600" },
    { name: "Royal Violet", color: "rgba(130, 45, 215, 0.65)", bg: "bg-purple-600" },
    { name: "Neon Cyan", color: "rgba(14, 185, 200, 0.65)", bg: "bg-cyan-500" },
    { name: "Sunset Orange", color: "rgba(225, 95, 20, 0.65)", bg: "bg-orange-600" },
    { name: "Champagne Luxe", color: "rgba(225, 195, 120, 0.65)", bg: "bg-yellow-200" },
    { name: "Crimson Coral", color: "rgba(225, 45, 85, 0.65)", bg: "bg-rose-600" },
    { name: "Electric Magenta", color: "rgba(200, 30, 160, 0.65)", bg: "bg-fuchsia-600" },
    { name: "Velvet Plum", color: "rgba(100, 25, 90, 0.70)", bg: "bg-purple-900" },
    { name: "Mint Lime", color: "rgba(35, 195, 115, 0.65)", bg: "bg-teal-400" },
    { name: "Bronze Amber", color: "rgba(165, 95, 35, 0.65)", bg: "bg-amber-700" }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: any) => {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      category: product.category,
      image_url: product.image_url || "",
      images: product.images || [],
      stock_quantity: product.stock_quantity?.toString() || "0",
      glow_color: product.glow_color || product.glowColor || "rgba(35, 95, 175, 0.55)",
      display_order: product.display_order?.toString() || product.sort_order?.toString() || "1"
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      category: "Watches",
      image_url: "",
      images: [],
      stock_quantity: "10",
      glow_color: "rgba(35, 95, 175, 0.55)",
      display_order: (products.length + 1).toString()
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
      router.refresh();
    } else {
      if (error.message.includes('order_items_product_id_fkey') || error.code === '23503') {
        alert("Cannot delete product: This product is part of existing customer order(s).\n\nTo allow deleting products with orders, run the SQL migration query in your Supabase SQL Editor:\n\nALTER TABLE order_items DROP CONSTRAINT order_items_product_id_fkey;\nALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;");
      } else {
        alert("Error deleting product: " + error.message);
      }
    }
    setLoading(false);
  };

  const compressImageFile = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) return file;
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          'image/webp',
          0.82
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file);
      };
      img.src = url;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    
    const newImages = [...formData.images];
    
    try {
      const uploadData = new FormData();
      for (const rawFile of Array.from(e.target.files)) {
        const file = await compressImageFile(rawFile);
        uploadData.append("files", file);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload image");
      }

      if (data.urls && data.urls.length > 0) {
        data.urls.forEach((url: string) => {
          newImages.push(url);
        });
        if (!formData.image_url) {
          setFormData(prev => ({ ...prev, image_url: data.urls[0] }));
        }
      }
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (err: any) {
      alert("Error uploading image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload: any = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      category: formData.category,
      image_url: formData.images.length > 0 ? formData.images[0] : formData.image_url,
      images: formData.images,
      stock_quantity: parseInt(formData.stock_quantity),
      glow_color: formData.glow_color,
      display_order: parseInt(formData.display_order || "1")
    };

    if (isAdding) {
      let res = await supabase.from('products').insert(payload).select().single();
      
      // Fallback for missing columns in DB schema
      if (res.error && (res.error.message.includes('display_order') || res.error.message.includes('glow_color') || res.error.code === 'PGRST204')) {
        delete payload.display_order;
        delete payload.glow_color;
        res = await supabase.from('products').insert(payload).select().single();
      }

      if (!res.error && res.data) {
        setProducts([res.data, ...products]);
        handleCancel();
        router.refresh();
      } else {
        alert("Error adding product: " + res.error?.message);
      }
    } else if (isEditing) {
      let res = await supabase.from('products').update(payload).eq('id', isEditing).select().single();

      // Fallback for missing columns in DB schema
      if (res.error && (res.error.message.includes('display_order') || res.error.message.includes('glow_color') || res.error.code === 'PGRST204')) {
        delete payload.display_order;
        delete payload.glow_color;
        res = await supabase.from('products').update(payload).eq('id', isEditing).select().single();
      }

      if (!res.error && res.data) {
        setProducts(products.map(p => p.id === isEditing ? res.data : p));
        handleCancel();
        router.refresh();
      } else {
        alert("Error updating product: " + res.error?.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Page Title & Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#D4AF37]">
            Product Catalog Management
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
            Manage luxury watch models, baggy pants, and inventory pricing
          </p>
        </div>

        {!isAdding && !isEditing && (
          <button 
            onClick={handleAdd} 
            className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:from-[#F5D67B] hover:to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Product
          </button>
        )}
      </div>

      {/* Add / Edit Product Glass Form Modal Container */}
      {(isAdding || isEditing) && (
        <div className="bg-[#0D0D0F] p-8 rounded-2xl border border-[#D4AF37]/30 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">
              {isAdding ? "✨ Add New Product" : "✏️ Edit Product Details"}
            </h2>
            <button onClick={handleCancel} className="text-white/40 hover:text-white text-xs uppercase tracking-widest">
              Close [✕]
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Product Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Royal Chronograph Black Gold"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors"
                >
                  <option value="Men's Watches">Men's Watches</option>
                  <option value="Women's Watches">Women's Watches</option>
                  <option value="Watches">General Watches</option>
                  <option value="Pants">Pants</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  🔢 Display Order Sequence (#)
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.display_order} 
                  onChange={e => setFormData({...formData, display_order: e.target.value})} 
                  placeholder="e.g. 1 (Top Spot)"
                  className="w-full bg-[#050506] border border-[#D4AF37]/30 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Selling Price (Rs)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  placeholder="3000"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">
                  Original Strikethrough Price (Rs)
                </label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={formData.original_price} 
                  onChange={e => setFormData({...formData, original_price: e.target.value})} 
                  placeholder="6000"
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/70">Stock Quantity</label>
                <input 
                  required 
                  type="number" 
                  value={formData.stock_quantity} 
                  onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                  className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
                />
              </div>
            </div>

            {/* Product Images Drag & Upload Zone */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Product Image Gallery</label>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10">
                    <Image src={img} alt={`Product image ${idx}`} fill sizes="120px" unoptimized className="object-contain p-2" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#D4AF37] text-black font-extrabold text-[9px] text-center py-0.5 uppercase tracking-wider">
                        Main Image
                      </span>
                    )}
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4AF37] transition-all cursor-pointer bg-white/5 hover:bg-[#D4AF37]/5 group">
                  <Plus className="w-6 h-6 text-white/40 group-hover:text-[#D4AF37] mb-1 transition-colors" />
                  <p className="text-[10px] text-white/50 group-hover:text-white uppercase tracking-wider text-center px-1 font-semibold">Upload Image</p>
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} disabled={loading} />
                </label>
              </div>
            </div>

            {/* Background Ambient Glow Theme Selector */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                  ✨ Product Background Ambient Glow Theme
                </label>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">
                  Select Preset or Enter Custom RGBA/Hex
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5 items-center max-h-36 overflow-y-auto pr-1">
                {glowColorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, glow_color: preset.color })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all ${
                      formData.glow_color === preset.color
                        ? "border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${preset.bg}`} />
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Custom Glow Color String Input */}
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <label className="text-[11px] font-bold uppercase text-white/70 tracking-wider whitespace-nowrap">
                  Custom Color:
                </label>
                <input
                  type="text"
                  value={formData.glow_color}
                  onChange={(e) => setFormData({ ...formData, glow_color: e.target.value })}
                  placeholder="e.g. rgba(35, 95, 175, 0.55) or #D4AF37"
                  className="flex-1 bg-black/50 border border-white/15 focus:border-[#D4AF37] px-3 py-1.5 rounded-lg text-xs text-white font-mono outline-none"
                />
              </div>

              {/* Live Ambient Glow Gradient Preview */}
              <div 
                className="h-14 rounded-xl border border-white/10 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-white/90 shadow-inner transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.28) 0%, ${formData.glow_color || 'rgba(35, 95, 175, 0.55)'} 45%, #08080a 100%)`
                }}
              >
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Live Ambient Glow Preview</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Description</label>
              <textarea 
                rows={4} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="High precision Japanese quartz watch..."
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md"
              >
                {loading ? "Saving..." : "Save Product"}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      {!isAdding && !isEditing && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0D0D0F] p-4 rounded-2xl border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name..."
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] pl-11 pr-4 py-2.5 rounded-xl text-xs text-white outline-none transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table Card */}
          <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-white/80">
                <thead className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Pos (#)</th>
                    <th className="px-6 py-4">Thumbnail</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-white/40 uppercase tracking-wider">
                        No matching products found.
                      </td>
                    </tr>
                  ) : filteredProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono font-extrabold text-[#D4AF37]">
                        <span className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-1 rounded-lg text-xs">
                          #{product.display_order ?? product.sort_order ?? (index + 1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 relative bg-black/60 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-1 group-hover:border-[#D4AF37]/50 transition-colors">
                          {product.image_url ? (
                            <Image src={product.image_url} alt={product.name} fill sizes="48px" unoptimized className="object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-white/30" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white tracking-wide">
                        {product.name}
                        {product.original_price && (
                          <span className="block text-[10px] text-amber-400 font-semibold mt-0.5">
                            Sale Active (Drop Ticker Enabled)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 uppercase text-[10px] tracking-widest font-semibold text-white/60">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-[#D4AF37]">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          product.stock_quantity > 5 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : product.stock_quantity > 0
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-blue-400 border border-white/10 hover:border-blue-500/30 transition-all"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/10 hover:border-red-500/30 transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
