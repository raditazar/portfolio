import Image from "next/image";
import { ReactNode } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  techStack: string[];
  imageSrc: string;
  imageAlt: string;
  align?: "left" | "right";
  children?: ReactNode;
}

export default function ProjectCard({
  title,
  description,
  category,
  categoryColor,
  techStack,
  imageSrc,
  imageAlt,
  align = "left",
  children,
}: ProjectCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group/card:">
      <div
        className={`lg:col-span-5 flex flex-col gap-8 order-2 ${
          align === "left" ? "lg:order-1" : "lg:order-2"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative"></div>
          <span
            className={`
                            relative z-10 text-xs font-bold tracking-widest uppercase ${categoryColor}
                            px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm
                            transition-all duration-300 hover:bg-white/10 hover:scale-105
                        `}
          >
            {category}
          </span>
          <div
            className={`absolute inset-0 rounded-full ${categoryColor} opacity-20 blur-xl`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight group-hover/card:text-white/90 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-zinc-400 text-base md:text-lg  leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={tech}
              className="px-4 py-2 text-sm font-medium
                                border border-zinc-800 rounded-full 
                                text-zinc-300 bg-zinc-900/50
                                hover:bg-zinc-800/80 hover:border-zinc-700 hover:text-white
                                transition-all duration-300 hover:scale-105
                                animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: "500ms",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 pt-4">{children}</div>
      </div>

      <div
        className={`
                lg:col-span-7 order-1 ${
                  align === "left" ? "lg:order-2" : "lg:order-1"
                }`}
      >
        <div className="relative group/image">
          <div className="absolute -inset-1 bg-linear-to-r from-zinc-600 via-zinc-700 to-zinc-800 rounded-2xl opacity-0 group-hover/image:opacity-25 transition-opacity duration-500"></div>

          <div className=" relative aspect-video rounded-2xl  border border-zinc-800 overflow-hidden bg-zinc-900 group-hover/image:border-zinc-700 transition-all duration-500">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover group-hover/image:scale-110 transition-all group-hover/image:brightness-110 duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover/image:opacity-40 transition-opacity duration-500" />

            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-500 flex items-center justify-center">
              <div className="transform scale-0 group-hover/image:scale-100 transition-transform duration-500">
                <div className="px-6 py-3 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
                  <p className="text-sm font-medium text-white">View Project</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 bg-zinc-900 -z-10">
              <svg
                className="w-16 h-16 text-zinc-800 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-zinc-800 rounded-tr-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-zinc-800 rounded-bl-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  );
}
