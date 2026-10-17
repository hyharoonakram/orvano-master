"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10 w-full">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-heading text-white mb-2">
          <AnimatedCounter value={5000} suffix="+" />
        </div>
        <div className="text-white/60 text-[10px] tracking-widest uppercase">Happy Customers</div>
      </div>
      <div className="text-center lg:border-l lg:border-white/10">
        <div className="text-3xl md:text-4xl font-heading text-white mb-2">
          <AnimatedCounter value={50} suffix="+" />
        </div>
        <div className="text-white/60 text-[10px] tracking-widest uppercase">Countries Shipped</div>
      </div>
      <div className="text-center lg:border-l lg:border-white/10">
        <div className="text-3xl md:text-4xl font-heading text-white mb-2">
          <AnimatedCounter value={100} suffix="%" />
        </div>
        <div className="text-white/60 text-[10px] tracking-widest uppercase">Premium Quality</div>
      </div>
      <div className="text-center lg:border-l lg:border-white/10">
        <div className="text-3xl md:text-4xl font-heading text-white mb-2">
          <AnimatedCounter value={24} suffix="/7" duration={1} />
        </div>
        <div className="text-white/60 text-[10px] tracking-widest uppercase">Customer Support</div>
      </div>
    </div>
  );
}
