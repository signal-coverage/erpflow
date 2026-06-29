"use client";
import { motion, useReducedMotion } from "framer-motion";
import { steps, ease } from "./consts";

export function LandingInnovation() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            How ERPFlow works
          </h2>
          <p className="text-[#6B7280] mt-4 text-lg max-w-[48ch]">
            From setup to full operation in three steps. No consultant required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="border-t-2 border-[#1F7A5C] pt-8 pb-4 pr-8"
                initial={shouldReduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
              >
                <span className="text-sm font-mono font-bold text-[#1F7A5C] mb-4 block">
                  {step.number}
                </span>
                <div className="size-11 rounded-xl bg-[#EAF4EF] flex items-center justify-center mb-5">
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className="text-[#1F7A5C]"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
