import { useMemo, useState } from 'react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'

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

  const openReel = (e) => {
    e.preventDefault()
    setReelOpen(true)
    setIsMenuOpen(false)
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
              <a href="#projects" className="text-xl text-black hover:opacity-80 transition-colors">
                Projects
              </a>
              <a href="#about" className="text-xl text-black hover:opacity-80 transition-colors">
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
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <a href="#projects" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Projects
                </a>
                <a href="#about" className="text-sm text-gray-600 hover:text-black transition-colors">
                  About
                </a>
                <button
                  type="button"
                  onClick={openReel}
                  className="text-sm text-gray-600 hover:text-black transition-colors text-left"
                >
                  Reel
                </button>
                {/* <a href="#contact" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Contact
                </a> */}
              </nav>
            </div>
          )}
        </div>
      </header>
      <LightboxVideo open={reelOpen} onClose={() => setReelOpen(false)} src={reelSrc} title="Reel" />
    </>
  )
}
