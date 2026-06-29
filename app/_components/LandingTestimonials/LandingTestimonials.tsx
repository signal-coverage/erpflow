"use client";
import { motion, useReducedMotion } from "framer-motion";
import { testimonials, ease } from "./consts";

export function LandingTestimonials() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            What healthcare teams say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-[#F7F7F5] rounded-2xl p-7"
              initial={shouldReduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <p className="text-[#374151] text-base leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <p className="font-semibold text-[#111111] text-sm">{t.name}</p>
                <p className="text-[#6B7280] text-xs mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
