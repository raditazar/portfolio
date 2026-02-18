import Link from 'next/link'
import HomeLightRays from './HomeLightRays'

export default function Footer() {
    return(
        <footer id='contact' className='relative text-white pt-32 pb-10 overflow-hidden'>
            <HomeLightRays />
            <div className='relative z-10 max-w-7xl mx-auto px-6'>
                <div className='mb-24'>
                    <p className='text-2xl md:text-3xl text-gray-400 mb-8'>
                        Have an idea? Ready to collaborate?
                    </p>

                    <Link href="mailto:radityaazhar@gmail.com"
                        className='text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter hover:text-gray-300 transition-colors underline decoration-2 underline-offset-8 decoration-gray-600 hover:decoration-white'
                    >
                        radityaazhar@gmail.com
                    </Link>
                </div>

                <div className='flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/10'>
                    <div className='flex gap-8'>
                        <Link href="https://www.linkedin.com/in/raditya-azhar-ananta" target='_blank' className='font-medium  hover:text-gray-300 transition-colors'>
                            LinkedIn
                        </Link>
                        <Link href="https://github.com/raditazar" target='_blank' className='font-medium  hover:text-gray-300 transition-colors'>
                            GitHub
                        </Link>
                        <Link href="https://instagram.com/raditazar_" target='_blank' className='font-medium  hover:text-gray-300 transition-colors'>
                            Instagram
                        </Link>
                    </div>
                    <p className='text-gray-500 text-sm'>
                        © {new Date().getFullYear()} Raditya Azhar Ananta. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    )
}