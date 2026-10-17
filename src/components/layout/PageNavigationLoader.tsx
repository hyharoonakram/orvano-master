"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast micro-progress bar that completes instantly
    setLoading(true);
    setProgress(70);

    const timer1 = setTimeout(() => {
      setProgress(100);
    }, 60);

    const timer2 = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 180);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: `${progress}%`, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeOut", duration: 0.25 }}
          className="h-[2.5px] bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#FFF8DC] shadow-[0_0_12px_rgba(212,175,55,0.9)]"
        />
      </AnimatePresence>
    </div>
  );
}

export function PageNavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
