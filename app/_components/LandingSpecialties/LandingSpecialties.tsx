"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { specialties, ease } from "./consts";

export function LandingSpecialties() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="specialties" className="py-24 bg-[#F7F7F5]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-14"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
            Built for every specialty
          </h2>
          <p className="text-[#6B7280] mt-4 text-lg max-w-[48ch]">
            ERPFlow&apos;s plugin system supports virtually any medical
            discipline without changing your core.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Accordion */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <Accordion
              type="single"
              defaultValue="odontology"
              collapsible
              className="w-full"
            >
              {specialties.map((s) => (
                <AccordionItem
                  key={s.value}
                  value={s.value}
                  className="border-[#E5E7EB]"
                >
                  <AccordionTrigger className="text-[#111111] font-semibold text-base py-4 hover:no-underline hover:text-[#1F7A5C] data-[state=open]:text-[#1F7A5C]">
                    {s.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#6B7280] text-sm leading-relaxed">
                    {s.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 16px 48px -12px rgba(31,122,92,0.15), 0 4px 12px -4px rgba(0,0,0,0.08)",
            }}
            initial={shouldReduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease }}
          >
            <div className="relative aspect-4/3">
              <Image
                src="https://picsum.photos/seed/erpflow-specialty/800/600"
                alt="Medical specialty care"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
