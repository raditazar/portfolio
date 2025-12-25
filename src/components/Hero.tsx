import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-20 relative">
      <div className="absolute top-0 right-0 w-full h-[120%] pointer-events-none z-0">
        <img 
          src="/assets/hero.svg" 
          alt="" 
          className="w-full h-full object-cover object-right-top opacity-40 lg:opacity-60" 
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-br from-black via-transparent to-transparent pointer-events-none z-1" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none z-1" />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="block mb-2">Front-End Developer</span>
              <span className="block text-zinc-400">translating complex logic</span>
              <span className="block text-2xl md:text-3xl xl:text-4xl text-zinc-500 font-normal mt-4">
                - From AI models to blockchain -
              </span>
              <span className="block mt-4 bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                into clean, accessible, and functional user interfaces.
              </span>
            </h1>

            {/* Subheadline */}
            <div className="flex flex-col gap-6">
              <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
                Based in <span className="text-white font-medium">Yogyakarta</span>. 
                Interested in <span className="text-white font-medium">AI</span> and <span className="text-white font-medium">on-chain data</span>.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-2">
                <Link
                  href="https://github.com/raditazar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
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
                  className="group relative p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300"
                >
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
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
                  className="group relative px-6 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-white hover:border-white transition-all duration-300"
                >
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-black transition-colors">
                    Get in touch
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-zinc-600 to-zinc-800 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Image container */}
              <div className="relative w-[300px] h-[400px] lg:w-[350px] lg:h-[480px] xl:w-[400px] xl:h-[520px]">
                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-colors duration-500">
                  <Image
                    src="/images/profile.JPG"
                    alt="Raditazar Profile Picture"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    priority
                  />
                  {/* Overlay linear */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl border border-zinc-800 bg-black/80 backdrop-blur-md">
                <p className="text-sm font-medium">Based in YK 🇮🇩</p>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* <div className="pointer-events-none absolute bottom-0 left-0 w-full h-48 bg-linear-to-b from-transparent to-[#0B0F14]" /> */}

    </section>
  );
}