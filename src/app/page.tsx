import Hero from "@/components/home/Hero";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <Categories />
      <WhyChooseUs />
      <Statistics />
      <Testimonials />
      <Newsletter />
      <FAQ />
      <CTA />
    </>
  );
}
