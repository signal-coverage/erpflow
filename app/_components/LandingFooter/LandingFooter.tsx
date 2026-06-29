"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { links, ease } from "./consts";

export function LandingFooter() {
  const shouldReduce = useReducedMotion();

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease }}
        >
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-7 rounded-[6px] bg-[#1F7A5C] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-[13px] leading-none select-none">
                  E
                </span>
              </div>
              <span className="font-bold text-[15px] tracking-tight">
                ERPFlow
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-[22ch]">
              The integrated ERP platform built for healthcare organizations of
              every size.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white/90 text-sm mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-white/50 hover:text-white/80 transition-colors text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-white/30 text-sm gap-2">
          <span>2026 ERPFlow. All rights reserved.</span>
          <span>Built for healthcare teams.</span>
        </div>
      </div>
    </footer>
  );
}
