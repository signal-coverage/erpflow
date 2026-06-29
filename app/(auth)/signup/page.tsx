"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

const appearance = {
  variables: {
    colorPrimary: "#7C5CFF",
    colorText: "#111827",
    colorTextSecondary: "#6B7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#111827",
    colorTextOnPrimaryBackground: "#ffffff",
    borderRadius: "10px",
    fontFamily: "inherit",
    fontSize: "14px",
    spacingUnit: "16px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "!shadow-none !border-0 w-full",
    card: "!pt-3",
    headerTitle: "!hidden",
    headerSubtitle: "!hidden",
    formButtonPrimary: "!rounded-[10px] !h-12 !font-medium !shadow-sm",
    socialButtonsBlockButton:
      "!rounded-[10px] !h-12 !border-gray-200 hover:!bg-gray-50",
    formFieldInput: "!rounded-[10px] !h-12 !border-gray-200",
    formFieldLabel: "!text-sm !font-medium !text-gray-700",
    dividerLine: "!bg-gray-200",
    footer: "!bg-white",
    footerPagesLink: "!text-[#7C5CFF]",
    identityPreviewEditButton: "!text-[#7C5CFF]",
  },
};

export default function SignupPage() {
  return (
    <motion.div
      className="w-full"
      style={{ maxWidth: "360px" }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mb-4 text-center">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Get started with ERPFlow today.
        </p>
      </div>

      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={appearance}
      />
    </motion.div>
  );
}
