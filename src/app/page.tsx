import HeroSection from "@/components/HeroSection";
import ParallaxImageSection from "@/components/ParallaxImageSection";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import ClosingSection from "@/components/ClosingSection";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ParallaxImageSection />
      <HorizontalScrollSection />
      <ClosingSection />
    </main>
  );
}
