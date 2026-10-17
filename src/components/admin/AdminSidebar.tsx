"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/contact", label: "Contact", icon: MessageSquare },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* 1. Mobile Top Header Bar */}
      <div className="md:hidden h-16 bg-[#0A0A0B] border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-50 w-full">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#AA771C] flex items-center justify-center font-black text-black text-xs shadow-[0_0_12px_rgba(212,175,55,0.4)]">
            O
          </div>
          <div>
            <span className="font-extrabold text-xs tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] uppercase block">
              ORVANO
            </span>
            <span className="text-[8px] uppercase tracking-widest text-white/40 block font-semibold">
              ADMIN CONTROL
            </span>
          </div>
        </Link>

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white active:scale-95 transition-all"
          aria-label="Toggle Admin Menu"
        >
          {isOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5 text-[#D4AF37]" />}
        </button>
      </div>

      {/* 2. Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={closeSidebar}
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* 3. Combined Sidebar (Desktop Permanent + Mobile Slide-over Drawer) */}
      <aside className={`
        fixed md:static top-0 bottom-0 left-0 z-50
        w-72 md:w-64 bg-[#0A0A0B] border-r border-white/10 
        flex flex-col min-h-screen text-white select-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Brand Header */}
        <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-white/10 bg-black/40">
          <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-[#AA771C] flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              O
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#AA771C] uppercase block">
                ORVANO
              </span>
              <span className="text-[9px] uppercase tracking-widest text-white/40 block font-semibold">
                COMMAND CENTER
              </span>
            </div>
          </Link>

          {/* Close Button on Mobile Drawer */}
          <button 
            onClick={closeSidebar}
            className="md:hidden text-white/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Status Badge */}
        <div className="mx-4 mt-4 md:mt-6 mb-2 px-3 py-2 rounded-lg bg-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2FA Secured</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-2">
            Core Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center justify-between px-3.5 py-3 md:py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] border-l-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                    : "text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-white/50"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* View Storefront Link */}
        <div className="px-4 py-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all font-semibold tracking-wider group"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60">
          <div className="mb-1 px-1">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Logged in as</p>
            <p className="text-xs text-white/90 font-medium truncate mt-0.5">{email}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
