import Categories from "@/components/modules/home/Categories";
import CTA from "@/components/modules/home/CTA";
import Featured from "@/components/modules/home/Featured";
import Hero from "@/components/modules/home/Hero";
import HowItWorks from "@/components/modules/home/HowItWorks";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <HowItWorks />
      <CTA />
    </>
  );
}
