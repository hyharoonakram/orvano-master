"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || pathname?.startsWith("/admin")) {
    return null;
  }

  const isProductPage = pathname?.startsWith("/product/");
  const whatsappUrl = "https://wa.me/923000138707?text=Hello%20ORVANO,%20I%20have%20an%20inquiry.";

  return (
    <div 
      className={`fixed ${isProductPage ? "bottom-20 md:bottom-6" : "bottom-6"} right-5 z-50 flex items-center justify-center transition-opacity duration-500`}
    >
      <Link 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center group"
      >
        {/* Blinking Pulse Radar Waves */}
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none duration-1000" />
        <span className="absolute -inset-3.5 rounded-full bg-[#25D366]/20 animate-pulse pointer-events-none" />

        {/* Blinking Floating Button */}
        <motion.div
          animate={{
            scale: [1, 1.07, 1],
            boxShadow: [
              "0 0 15px rgba(37,211,102,0.5)",
              "0 0 30px rgba(37,211,102,0.95)",
              "0 0 15px rgba(37,211,102,0.5)",
            ],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-colors duration-300"
        >
          {/* Blinking WhatsApp Icon */}
          <motion.div
            animate={{
              opacity: [1, 0.65, 1],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center"
          >
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7 fill-white drop-shadow-md" 
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </motion.div>

          {/* Active Blinking Online Dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-black" />
          </span>
        </motion.div>
        
        {/* Tooltip on hover (desktop only) */}
        <div className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-black/90 border border-[#25D366]/30 text-white text-xs uppercase tracking-widest font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl">
          Chat with us on WhatsApp
        </div>
      </Link>
    </div>
  );
}


