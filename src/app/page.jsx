import CTASection from "@/components/call-to-action";
import AvailableTutorsSection from "@/components/featured-section";
import HeroSection from "@/components/hero-section";
import HowItWorksSection from "@/components/how-it-work-section";
import LearningCategoriesSection from "@/components/learn-section";
import RadialCarousel from "@/components/radial-carosel";
import StudentSuccessSection from "@/components/student-section";
import WhyChooseSection from "@/components/why-mediqueue";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AvailableTutorsSection />
      <WhyChooseSection />
      <LearningCategoriesSection />
      <HowItWorksSection />
      <StudentSuccessSection />
      <CTASection />
    </div>
  );
}
