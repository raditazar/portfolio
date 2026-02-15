import Image from "next/image";
import Link from "next/link";
import FloatingLines from "./FloatingLines";
import CardSwap, { Card } from "./CardSwap";
export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-20 relative overflow-x-clip overflow-y-visible">
      {/* Background FloatingLines */}
      <div className="absolute inset-0 w-full h-full z-0">
        <FloatingLines
          enabledWaves={["middle", "top"]}
          lineCount={4}
          lineDistance={60}
          bendRadius={5}
          bendStrength={0}
          interactive={true}
          parallax={true}
        />
      </div>

      {/* Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0B0F14] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="max-w-3xl">
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.3]">
              <span className="block mb-2 text-white">Front-End Developer</span>
              <span className="block text-zinc-300 mb-3">
                focused on <span className="text-blue-400">Machine Learning</span>
              </span>
              <span className="block text-zinc-300">
                building <span className="text-purple-400">user interfaces</span>
              </span>
            </h1>

            {/* Subheadline */}
            <div className="flex flex-col gap-5">
              <p className="text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed">
                Based in <span className="text-white font-semibold">Yogyakarta</span>. 
                Building ML-powered interfaces and <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">on-chain applications</span>.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-2">
                <Link
                  href="https://github.com/raditazar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl border border-zinc-700/50 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-purple-500/50 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-zinc-300 group-hover:text-purple-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                </Link>

                <Link
                  href="https://www.linkedin.com/in/raditya-azhar-ananta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl border border-zinc-700/50 bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-blue-500/50 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-zinc-300 group-hover:text-blue-400 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
                </Link>

                <Link
                  href="mailto:raditazar@example.com"
                  className="group relative px-6 py-3 rounded-xl border border-zinc-700/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Get in touch
                  </span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CardSwap - absolute bottom-right, bleeds down & clips right */}
      <div className="hidden lg:block absolute -bottom-16 right-0 z-30" style={{ transform: 'translateY(45%)' }}>
        {/* Glow effect */}
        <div className="absolute -inset-16 bg-gradient-to-l from-purple-600/15 via-blue-600/10 to-transparent rounded-3xl blur-3xl opacity-60 pointer-events-none" />
        
        <div className="relative" style={{ marginRight: '-15px' }}>
          <CardSwap
            width={650}
            height={500}
            cardDistance={55}
            verticalDistance={65}
            delay={4000}
            pauseOnHover={false}
            skewAmount={5}
            easing="elastic"
          >
            <Card customClass="profile-card" >
              <Image
                src="/images/IMG_8407.JPG"
                alt="Profile Card"
                width={650}
                height={500}
                className="rounded-2xl shadow-xl"
              />
            </Card>
            <Card customClass="profile-card" />
            <Card customClass="profile-card" />
          </CardSwap>
        </div>
      </div>
    </section>
  );
}