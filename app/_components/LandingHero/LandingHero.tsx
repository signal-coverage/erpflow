"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ease } from "./consts";

export function LandingHero() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="min-h-dvh flex items-center bg-[#F7F7F5] pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] text-[#111111]"
              initial={shouldReduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
            >
              Run your clinic.
              <br />
              <span className="text-[#1F7A5C]">Not your software.</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-[#6B7280] leading-relaxed max-w-[44ch]"
              initial={shouldReduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
            >
              One platform for patients, staff, schedules, and billing. Built
              for modern healthcare teams.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 mt-8"
              initial={shouldReduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#1F7A5C] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#17614a] active:scale-[0.98] transition-all"
              >
                Start for free
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center border border-[#D1D5DB] text-[#374151] rounded-full px-6 py-3 text-sm font-semibold hover:border-[#1F7A5C] hover:text-[#1F7A5C] transition-colors"
              >
                See how it works
              </Link>
            </motion.div>
          </div>

          {/* Right: Preview image */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: 20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease }}
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{
                boxShadow:
                  "0 24px 64px -16px rgba(31,122,92,0.2), 0 4px 16px -4px rgba(0,0,0,0.08)",
              }}
            >
              <div className="relative aspect-4/3">
                <Image
                  src="https://picsum.photos/seed/erpflow-clinic/900/675"
                  alt="ERPFlow clinical management platform"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-[#E5E7EB]">
                <p className="text-[#111111] text-sm font-semibold">
                  500+ clinics worldwide
                </p>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  active on ERPFlow today
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
