import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import { useScroll } from '@/hooks/useScroll'
import ThemeToggle from './ThemeToggle'
import { MAIN_REEL } from '../data/projects'

const NAVBAR_HEIGHT = 80 // approx 16 * 5 or similar, depending on design

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [reelOpen, setReelOpen] = useState(false)
  const reelUrl = MAIN_REEL.url
  const reelSrc = useMemo(() => toEmbedSrc(reelUrl) || reelUrl, [reelUrl])

  const scrollTo = useScroll(NAVBAR_HEIGHT)

  const handleNavClick = (e, id) => {
    e.preventDefault()
    setIsMenuOpen(false)
    scrollTo(id)
  }

  const openReel = (e) => {
    e.preventDefault()
    setIsMenuOpen(false)
    setReelOpen(true)
  }

  const navLinks = [
    { label: 'Projects', href: 'projects' },
    { label: 'About', href: 'about' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-[color:var(--neo-border)] transition-all">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <a href="#" className="text-3xl md:text-4xl font-bold uppercase text-foreground tracking-tighter hover:underline decoration-4 underline-offset-4">
                Alejandro animates
              </a>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={`#${link.href}`}
                  className="text-xl font-bold uppercase text-foreground hover:bg-foreground hover:text-background px-2 py-1 transition-colors"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={openReel}
                className="neo-button px-6 py-2 uppercase text-lg cursor-pointer" // Overriding padding for header
              >
                Reel
              </button>
              <ThemeToggle />
            </nav>

            {/* Mobile Header Controls */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed top-20 left-0 right-0 z-50 bg-background border-b border-border shadow-lg"
            >
              <nav className="flex flex-col p-6 space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`#${link.href}`}
                    className="text-2xl font-light text-foreground"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={openReel}
                  className="text-2xl font-light text-foreground text-left cursor-pointer"
                >
                  Reel
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LightboxVideo
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        src={reelSrc}
        title={MAIN_REEL.title}
      />
    </>
  )
}
