"use client"

import { useRef, useEffect } from "react"
import Search from './Search'
import UserMenu from './UserMenu'
import Container from '../Containers'
import Logo from './logo'


interface NavbarProps {
  onHeight: (height: number) => void
}

const Navbar = ({ onHeight }: NavbarProps) => {
    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateHeight = () => {
        if (navRef.current) {
            onHeight(navRef.current.offsetHeight)
        }
        }

        // Mesure initiale
        updateHeight()

        // Mise à jour quand on resize (mobile ↔ desktop)
        window.addEventListener("resize", updateHeight)

        return () => window.removeEventListener("resize", updateHeight)
    }, [onHeight])

    return (
        <div ref={navRef} className='fixed w-full bg-white z-10 shadow-sm'>
            <div className='py-4 md:border-b'>
                <Container>
                    <div className='flex items-center justify-between gap-3 md:gap-0'>
                        {/* Logo — centré sur mobile */}
                        <div className="flex-1 md:flex-none flex justify-start md:justify-normal">
                            <Logo />
                        </div>

                        {/* Search — caché sur mobile */}
                        <div className="hidden md:block">
                            <Search />
                        </div>

                        {/* Menu utilisateur — toujours visible */}
                        <div className="flex-1 md:flex-none flex justify-end">
                            <UserMenu />
                        </div>
                        
                    </div>
                </Container>
            </div>

            {/* Barre de recherche mobile */}
            <div className="md:hidden px-4 pb-3">
                <Search />
            </div>
            
        </div>
    )
}

export default Navbar