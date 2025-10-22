import { useCallback, useMemo, useState } from 'react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'

const NAVBAR_HEIGHT = 10

function MenuIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function XIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [reelOpen, setReelOpen] = useState(false)
  const reelUrl = 'https://vimeo.com/957666816?fl=ip&fe=ec'
  const reelSrc = useMemo(() => toEmbedSrc(reelUrl) || reelUrl, [reelUrl])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const scrollToSection = useCallback((hash) => {
    if (!hash) return
    const id = hash.replace(/^#/, '')
    if (!id) return
    const section = document.getElementById(id)
    if (!section) return

    const rect = section.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0
    const sectionTop = currentScroll + rect.top
    const sectionHeight = rect.height
    let target = sectionTop

    if (sectionHeight < viewportHeight) {
      target = sectionTop - (NAVBAR_HEIGHT * 1.2) - (viewportHeight - sectionHeight) / 2
    } else {
      target = sectionTop + NAVBAR_HEIGHT * 1.2
    }

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
    const clamped = Math.max(0, Math.min(target, maxScroll))

    window.scrollTo({
      top: clamped,
      behavior: 'smooth',
    })
  }, [])

  const handleNavClick = useCallback(
    (event, hash) => {
      event.preventDefault()
      closeMenu()
      scrollToSection(hash)
    },
    [closeMenu, scrollToSection]
  )
  const openReel = (e) => {
    e.preventDefault()
    closeMenu()
    setReelOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-150">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="#" className="text-3xl md:text-4xl font-normal text-black">
                Alejandro animates
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-10">
              <a
                href="#projects"
                className="text-xl text-black hover:opacity-80 transition-colors"
                onClick={(event) => handleNavClick(event, '#projects')}
              >
                Projects
              </a>
              <a
                href="#about"
                className="text-xl text-black hover:opacity-80 transition-colors"
                onClick={(event) => handleNavClick(event, '#about')}
              >
                About
              </a>
              <button
                type="button"
                onClick={openReel}
                className="text-xl text-black hover:opacity-80 transition-colors"
              >
                Reel
              </button>
              {/* <a href="#contact" className="text-xl text-black hover:opacity-80 transition-colors">
                Contact
              </a> */}
            </nav>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/20 transition-opacity duration-200 ease-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      />
      <div
        className={`md:hidden fixed top-16 inset-x-0 z-50 transition-transform transition-opacity duration-200 ease-out origin-top transform ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="bg-white border-t border-gray-100 py-4 shadow-lg">
          <nav className="flex flex-col space-y-4 px-4">
            <a
              href="#projects"
              className="text-lg text-black hover:text-gray-800 transition-colors"
              onClick={(event) => handleNavClick(event, '#projects')}
            >
              Projects
            </a>
            <a
              href="#about"
              className="text-lg text-black hover:text-gray-800 transition-colors"
              onClick={(event) => handleNavClick(event, '#about')}
            >
              About
            </a>
            <button
              type="button"
              onClick={openReel}
              className="text-lg text-black hover:text-gray-800 transition-colors text-left"
            >
              Reel
            </button>
            {/* <a href="#contact" className="text-lg text-black hover:text-gray-800 transition-colors">
              Contact
            </a> */}
          </nav>
        </div>
      </div>
      <LightboxVideo open={reelOpen} onClose={() => setReelOpen(false)} src={reelSrc} title="Animation Reel" />
    </>
  )
}
