import Navbar from "@/components/Navbar";
import ScrollExperience from "@/components/ScrollExperience";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import LiquidCursor from "@/components/LiquidCursor";
import { ArcRevealHero } from "@/components/ui/arc-preloader-hero";
import HomeLightRays from "@/components/HomeLightRays";
import { getFeaturedProjects, getGallery, getSiteData } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [site, featured, gallery] = await Promise.all([
    getSiteData(),
    getFeaturedProjects(4),
    getGallery(),
  ]);

  return (
    <main className="min-h-screen bg-[#0E0717] text-white selection:bg-white selection:text-[#120820] overflow-x-clip relative">
      <ArcRevealHero greetingHold={300}>
        {/* Background LightRays in Plum ambience */}
        <HomeLightRays />

        <div className="relative z-10">
          <Navbar socials={site.socials} cvUrl={site.profile.cvUrl} />
          <ScrollExperience
            projects={featured.projects}
            totalProjectCount={featured.totalProjectCount}
            profile={site.profile}
            socials={site.socials}
            gallery={gallery}
          />
          <Footer profile={site.profile} socialLinks={site.socials} />
        </div>

        <ScrollToTop />
      </ArcRevealHero>
      <LiquidCursor />
    </main>
  );
}
