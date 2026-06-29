"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NAV, ease } from "./consts";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_#E5E7EB]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="size-7 rounded-[6px] bg-[#1F7A5C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[13px] leading-none select-none">
                E
              </span>
            </div>
            <span className="font-bold text-[15px] text-[#111111] tracking-tight">
              ERPFlow
            </span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 + i * 0.05, ease }}
            >
              <Link
                href={link.href}
                className="text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.27, ease }}
        >
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center bg-[#1F7A5C] text-white rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#17614a] active:scale-[0.98] transition-all"
          >
            Get started
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
