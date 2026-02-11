import ProjectCard from "./ProjectCard";
import Link from "next/link";

export default function Projects() {
    return (
        <section id="work" className="relative py-32 text-white overflow-visible">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-transparent via-transparent to-[#0B0F14]/80 z-[1]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-20 text-white">
                    Selected Work
                </h2>
                <div className="flex flex-col gap-32">
                    {/* Project 1 */}
                    <ProjectCard
                        title="Movo - Onchain Invoicing"
                        description="Traditional international payments are slow and opaque. Movo cobines the speed of crypto with the accountability of fiat-linked ledgers, making every settlement verifiable."
                        category="WEB3 / FINTECH"
                        categoryColor="text-green-400"
                        techStack={["Next.js", "Wagmi", "TypeScript", "Tailwind"]}
                        imageSrc="/images/project-movo.png"
                        imageAlt="Movo App Interface"
                        align="left"
                    >
                        <Link
                            href="https://movopay.vercel.app/"
                            target="_blank"
                            className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Live Demo
                        </Link>
                        <Link
                            href="https://github.com/Movo-Labs"
                            target="_blank"
                            className="px-8 py-3 border border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            GitHub
                        </Link>
                    </ProjectCard>
                    {/* Project 2 */}
                    <ProjectCard
                        title="FnB Inventory & Production"
                        description="Manual kitchen management led to misstracking and waste. Acting as Product Manager, I bridged the gap between client need and techinal execution, designin a seamless inventory tracking system."
                        category="UX / PRODUCT MGMT"
                        categoryColor="text-blue-400"
                        techStack={["React Native", "Golang", "Next.js", "Figma"]}
                        imageSrc="/images/project-fnb.png"
                        imageAlt="FnB Wireframe"
                        align="right"
                    >
                        <Link
                            href="/projects/fnb"
                            className="text-white font-bold border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all"
                        >
                            Read Case Study
                        </Link>
                    </ProjectCard>
                </div>
            </div>
        </section>
    )
}