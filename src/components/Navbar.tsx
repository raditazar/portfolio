"use client"

import CardNav from './CardNav'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'

export default function Navbar() {
    const items = [
        {
            label: 'Projects',
            bgColor: '#0d0716',
            textColor: '#FFFFFF',
            links: [
                { label: "Featured", ariaLabel: "Featured Projects", href: "/projects" },
                { label: "All Projects", ariaLabel: "All Projects", href: "/projects?tab=all" },
            ]
        },
        {
            label: 'About',
            bgColor: '#170D27',
            textColor: '#FFFFFF',
            links: [
                { label: "Career", ariaLabel: "About Career", href: "/about" },
                { label: "Me", ariaLabel: "About Me", href: "/about?tab=me" },
            ]
        },
        {
            label: 'Contact',
            bgColor: '#271e37',
            textColor: '#FFFFFF',
            links: [
                { label: "Email", ariaLabel: "Email me", href: "#contact" },
                { label: "Github", ariaLabel: "Github profile", href: "https://github.com/raditazar" },
                { label: "LinkedIn", ariaLabel: "LinkedIn profile", href: "https://www.linkedin.com/in/raditya-azhar-ananta" },
            ]
        },
    ]

    return (
        <CardNav
            logo="/assets/dark_logo.png"
            logoAlt="Raditazar Logo"
            items={items}
            baseColor='#fff'
            menuColor='#000'
            buttonBgColor='#111'
            buttonTextColor='#fff'
            ease='power3.out'
            rightSlot={
                <AnimatedThemeToggler
                    className="p-2 rounded-lg hover:bg-black/10 transition-colors"
                />
            }
        />
    )
}