import LandingNav from "@/app/_components/LandingHeader";
import { LandingHero } from "@/app/_components/LandingHero";
import { LandingTrusted } from "@/app/_components/LandingTrusted";
import { LandingAbout } from "@/app/_components/LandingAbout";
import { LandingServices } from "@/app/_components/LandingFeatures";
import { LandingInnovation } from "@/app/_components/LandingHow";
import { LandingSpecialties } from "@/app/_components/LandingSpecialties";
import { LandingTestimonials } from "@/app/_components/LandingTestimonials";
import { LandingCtaBanner } from "@/app/_components/LandingCtaBanner";
import { LandingFooter } from "@/app/_components/LandingFooter";

export default function HomePage() {
  return (
    <div className="font-(family-name:--font-jakarta) bg-[#F7F7F5]">
      <LandingNav />
      <LandingHero />
      <LandingTrusted />
      <LandingAbout />
      <LandingServices />
      <LandingInnovation />
      <LandingSpecialties />
      <LandingTestimonials />
      <LandingCtaBanner />
      <LandingFooter />
    </div>
  );
}
