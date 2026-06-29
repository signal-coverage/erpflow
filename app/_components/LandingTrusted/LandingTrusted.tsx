"use client";
import { motion, useReducedMotion } from "framer-motion";
import { brands, ease } from "./consts";

export function LandingTrusted() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-14 bg-white border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          className="text-sm text-[#9CA3AF] text-center mb-8"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          Trusted by 500+ healthcare organizations worldwide
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {brands.map((name, i) => (
            <motion.div
              key={name}
              className="flex items-center gap-2"
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 0.45, y: 0 }}
              whileHover={{ opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  width="20"
                  height="20"
                  rx="4"
                  fill="#1F7A5C"
                  fillOpacity="0.65"
                />
                <text
                  x="10"
                  y="14"
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  {name[0]}
                </text>
              </svg>
              <span className="font-semibold text-[15px] text-[#374151] tracking-tight">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
