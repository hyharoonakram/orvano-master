"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options?: SortOption[];
}

const DEFAULT_OPTIONS: SortOption[] = [
  { label: "Sort by: Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

export function SortDropdown({ value, onChange, options = DEFAULT_OPTIONS }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative inline-block text-left z-30">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-48 sm:w-52 bg-[#0D0D0F] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg transition-all"
      >
        <span className="truncate">{activeOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-300 ml-2 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Custom Popup Menu */}
      {isOpen && (
        <>
          {/* Backdrop overlay to close when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-[#0D0D0F] border border-[#D4AF37]/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.95)] overflow-hidden z-50 py-1 divide-y divide-white/5 animate-in fade-in duration-200">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-between ${
                  value === opt.value
                    ? "bg-[#D4AF37] text-black font-extrabold"
                    : "text-white/80 hover:bg-white/10 hover:text-[#D4AF37]"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && <Check className="w-3.5 h-3.5 stroke-[3] ml-2 shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
