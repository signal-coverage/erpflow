"use client";
import { motion, useReducedMotion } from "framer-motion";
import { metrics, ease } from "./consts";

export function LandingAbout() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <p className="text-5xl font-bold text-[#1F7A5C] tracking-tight">
                {m.value}
              </p>
              <p className="text-sm text-[#6B7280] mt-2 font-medium">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
