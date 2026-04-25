"use client"

import Search from './Search'
import UserMenu from './UserMenu'
import Container from '../Containers'
import Logo from './logo'


const Navbar = () => {
  return (
    <div className='fixed w-full bg-white z-10 shadow-sm'>
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