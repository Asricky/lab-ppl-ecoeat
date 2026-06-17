import NavbarLanding from "@/components/landing/NavbarLanding";
import HeroSection from "@/components/landing/HeroSection";
import MitraMapSection from "@/components/landing/MitraMapSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CategorySection from "@/components/landing/CategorySection";
import ImpactSection from "@/components/landing/ImpactSection";
import ReviewSection from "@/components/landing/ReviewSection";
import PartnerMarquee from "@/components/landing/PartnerMarquee";
import FooterLanding from "@/components/landing/FooterLanding";

export const metadata = {
  title: "EcoEat - Penyelamatan Makanan Surplus & Cegah Sampah Organik",
  description: "Selamatkan makanan surplus lezat berdiskon tinggi dari merchant lokal favorit Anda. Mari berkolaborasi cegah sampah organik demi bumi berkelanjutan bersama EcoEat.",
};

export default function Home() {
  return (
    <div className="bg-[#F5FCED] min-h-screen text-[#142017] antialiased selection:bg-[#0F5A2A]/20 selection:text-[#0F5A2A]">
      {/* Navigation Bar */}
      <NavbarLanding />

      {/* Main Page Layout */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features / Alur Kerja Section */}
        <FeaturesSection />

        {/* Category Showcase Section */}
        <CategorySection />

        {/* National Partner Distribution Map */}
        <MitraMapSection />

        {/* Environmental Impact Statistics Section */}
        <ImpactSection />

        {/* Testimonials Review Section */}
        <ReviewSection />

        {/* Autoplay Infinite Scrolling Supporting Partners */}
        <PartnerMarquee />
      </main>

      {/* Footnote & Copyright Footer */}
      <FooterLanding />
    </div>
  );
}
