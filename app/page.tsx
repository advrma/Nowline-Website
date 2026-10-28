import { Motion } from "@/components/Motion";
import { WaveField } from "@/components/WaveField";
import { GlassFilters } from "@/components/GlassFilters";
import { MobileCta, Nav, Preloader } from "@/components/Chrome";
import { Story } from "@/components/sections/Story";
import { WorksWith } from "@/components/sections/WorksWith";
import { Statement } from "@/components/sections/Statement";
import { Waitlist } from "@/components/sections/Waitlist";
import { Faq, Footer } from "@/components/sections/Faq";

export default function Home() {
  return (
    <>
      <Preloader />
      <WaveField />
      <GlassFilters />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Story />
        <WorksWith />
        <Statement />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
      <MobileCta />
      <Motion />
    </>
  );
}
