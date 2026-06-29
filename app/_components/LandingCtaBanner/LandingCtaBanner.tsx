"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "./consts";

export function LandingCtaBanner() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="pricing" className="py-24 bg-[#F7F7F5]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="bg-[#1F7A5C] rounded-3xl p-12 md:p-16 text-center"
          initial={shouldReduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
          >
            Ready to modernize your practice?
          </motion.h2>

          <motion.p
            className="text-white/70 text-base mt-4 max-w-[38ch] mx-auto"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.18, ease }}
          >
            Start free. No credit card required. Cancel anytime.
          </motion.p>

          <motion.div
            className="inline-block mt-8"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.26, ease }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center bg-white text-[#1F7A5C] rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-[#F0FBF7] active:scale-[0.98] transition-all"
            >
              Start for free
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
