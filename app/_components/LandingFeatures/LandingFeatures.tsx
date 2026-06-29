"use client";
import { motion, useReducedMotion } from "framer-motion";
import { features, ease } from "./consts";

export function LandingServices() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="features" className="py-24 bg-[#F7F7F5]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            Everything your team needs
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-[52ch] text-lg">
            From first intake to final invoice, ERPFlow handles every clinical
            workflow with precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className={`${f.span} ${f.bg} rounded-2xl p-8 flex flex-col justify-between min-h-70`}
                initial={shouldReduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                whileHover={shouldReduce ? undefined : { y: -4 }}
              >
                <div>
                  <div
                    className={`size-11 rounded-xl ${f.iconWrap} flex items-center justify-center mb-5`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      className={f.iconColor}
                    />
                  </div>
                  <h3 className={`text-xl font-bold ${f.textColor} mb-2`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${f.bodyColor}`}>
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
