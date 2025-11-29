import Link from 'next/link'

export default function Navbar() {
    return(
        <nav className='fixed top-0 left-0 right-0 z-50  bg-red/50 backdrop-blur-lg'>
            <div className='max-w-7xl mx-auto px-6 h-20 flex justify-between items-center'>
                <Link href="/" className='text-xl font-bold tracking-tight text-white'>
                    Raditazar
                </Link>

                <div className='flex items-center gap-8'>
                    <Link 
                        href="#work"
                        className='text-sm font-semibold text-gray-400 hover:text-white transition-colors'
                    >
                        Work
                    </Link>
                    <Link 
                        href="#about"
                        className='text-sm font-semibold text-gray-400 hover:text-white transition-colors'
                    >
                        About
                    </Link>
                    <Link 
                        href="#contact"
                        className='text-sm font-semibold text-gray-400 hover:text-white transition-colors'
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    )
}