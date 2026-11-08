import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeLightRays from "@/components/HomeLightRays";
import { SplitHighlight } from "@/components/ui/split-highlight";
import AboutPageClient from "./AboutPageClient";
import { getCareer, getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About | Raditazar",
  description: "Learn more about my journey, career, and what drives me.",
};

export default async function AboutPage() {
  const [careers, site] = await Promise.all([getCareer(), getSiteData()]);

  return (
    <main className="min-h-screen bg-[#0E0717] text-white overflow-x-clip relative">
      <HomeLightRays />
      <div className="relative z-10">
        <Navbar socials={site.socials} cvUrl={site.profile.cvUrl} />
        <div className="pt-32 pb-20">
          <div className="max-w-8xl mx-auto px-6 sm:px-12">
            <div className="mb-12 grid md:grid-cols-12 gap-y-6">
              <SplitHighlight
                as="h1"
                wrapperClassName="md:col-span-12 w-fit"
                rect={{ top: "55%", left: "-100vw", right: "30%", bottom: "-6%" }}
                className="text-[clamp(4rem,14vw,13rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.05em] text-white"
              >
                About
              </SplitHighlight>
              <p className="md:col-start-8 md:col-span-5 text-base text-zinc-400">
                Get to know more about my journey, career, and what drives me.
              </p>
            </div>
            <AboutPageClient careers={careers} profile={site.profile} />
          </div>
        </div>
        <Footer profile={site.profile} socialLinks={site.socials} />
      </div>
    </main>
  );
}
