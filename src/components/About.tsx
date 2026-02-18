interface AboutProps {
  stats: {
    projects: number;
    technologies: number;
  };
}

export default function About({ stats }: AboutProps) {
  const yearsExp = new Date().getFullYear() - 2024;
  return (
    <section
      id="about"
      className="relative py-32 text-white overflow-hidden"
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zinc-900/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 sticky">
            <div className="lg:sticky lg:top-32">
              <div className="inline-block mb-4 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                  Get to know me
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                About Me
              </h2>
              
              <div className="mt-6 w-20 h-1 bg-linear-to-r from-white to-transparent rounded-full" />
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Introduction */}
            <div className="space-y-6 text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <p className="text-zinc-300">
                Based in <span className="text-white font-semibold">Yogyakarta</span>. I'm <span className="text-white font-semibold">Raditya Azhar Ananta</span>, an Information Engineering student who treats code as a creative medium.
              </p>
              <p className="text-zinc-400">
                Previously leading a team as a student organization head, I learned how to bridge technical execution with human empathy.
                My goal isn't just to build websites, but to build <span className="text-white font-medium">digital experiences</span> that feel natural and intuitive.
              </p>
            </div>

            {/* Currently Exploring Card */}
            <div 
              className="group relative p-8 rounded-2xl bg-linear-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-500 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-zinc-600 to-zinc-800 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
                    Currently Exploring
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-white/90 transition-colors">
                  AI & Machine Learning Bootcamp
                </h3>

                <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                  Deep diving into Large Language Models (LLM) and integrating <span className="text-white font-medium">Vercel AI SDK</span> with Next.js.
                  I'm building a bridge between prompt engineering and UI components to create smarter web applications.
                </p>

                {/* Progress indicator */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-linear-to-r from-white to-zinc-400 rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500">In Progress</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-white">{yearsExp}+</p>
                <p className="text-sm text-zinc-500">Years Experience</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-white">{stats.projects}</p>
                <p className="text-sm text-zinc-500">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-white">{stats.technologies}</p>
                <p className="text-sm text-zinc-500">Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}