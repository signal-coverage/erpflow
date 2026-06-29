"use client";

import { SignIn } from "@clerk/nextjs";
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
    card: "!pt-2",
    headerTitle: "!hidden",
    headerSubtitle: "!hidden",
    formButtonPrimary: "!rounded-[10px] !h-12 !font-medium !shadow-sm",
    socialButtonsBlockButton:
      "!rounded-[10px] !h-12 !border-gray-200 hover:!bg-gray-50",
    formFieldInput: "!rounded-[10px] !h-12 !border-gray-200",
    formFieldLabel: "!text-sm !font-medium !text-gray-700",
    dividerLine: "!bg-gray-200",
    dividerText: "!text-gray-400 !text-xs",
    footer: "!bg-white",
    footerPagesLink: "!text-[#7C5CFF]",
    identityPreviewEditButton: "!text-[#7C5CFF]",
  },
};

export default function LoginPage() {
  return (
    <motion.div
      className="w-full"
      style={{ maxWidth: "360px" }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back!
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          Sign in to your account to continue.
        </p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
        appearance={appearance}
      />
    </motion.div>
  );
}
