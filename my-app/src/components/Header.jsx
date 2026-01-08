import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import { useScroll } from '@/hooks/useScroll'
import ThemeToggle from './ThemeToggle'
import { PRIVATE_REEL } from '../data/profile'

const NAVBAR_HEIGHT = 80 // approx 16 * 5 or similar, depending on design

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [reelOpen, setReelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef(null)
  const desktopNavRef = useRef(null)
  const logoRef = useRef(null)

  const reelUrl = PRIVATE_REEL.url
  const reelSrc = useMemo(() => toEmbedSrc(reelUrl) || reelUrl, [reelUrl])

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !desktopNavRef.current || !logoRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const logoWidth = logoRef.current.offsetWidth

      // We use a hidden desktop nav to measure the "full" width needed
      const navWidth = desktopNavRef.current.offsetWidth

      // buffer for theme toggle + menu button + padding
      const isNowMobile = (logoWidth + navWidth + 80) > containerWidth

      setIsMobile(isNowMobile)
    }

    const observer = new ResizeObserver(checkOverflow)
    if (containerRef.current) observer.observe(containerRef.current)

    checkOverflow()
    return () => observer.disconnect()
  }, [])

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
    { label: 'Explore', href: 'explore' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-[color:var(--neo-border)] transition-all">
        <div ref={containerRef} className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300 relative">

            <div ref={logoRef} className="flex items-center shrink-0">
              <a href="#" className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-foreground tracking-tighter hover:underline decoration-4 underline-offset-4 transition-all whitespace-nowrap">
                Alejandro animates
              </a>
            </div>

            {/* PHANTOM NAV - Always in DOM but hidden, used for measurement only */}
            <div
              ref={desktopNavRef}
              className="absolute pointer-events-none invisible flex items-center space-x-8"
              aria-hidden="true"
            >
              {navLinks.map((link) => (
                <span key={link.href} className="text-xl font-bold uppercase px-2 py-1">{link.label}</span>
              ))}
              <span className="neo-button px-6 py-2 uppercase text-lg">Reel</span>
            </div>

            {/* REAL DESKTOP NAV */}
            {!isMobile && (
              <nav className="flex items-center space-x-4 lg:space-x-8 transition-all">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`#${link.href}`}
                    className="text-lg lg:text-xl font-bold uppercase text-foreground hover:bg-foreground hover:text-background px-2 py-1 transition-all"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={openReel}
                  className="neo-button px-4 py-1.5 lg:px-6 lg:py-2 uppercase text-base lg:text-lg cursor-pointer transition-all"
                >
                  Reel
                </button>
                <div className="shrink-0">
                  <ThemeToggle />
                </div>
              </nav>
            )}

            {/* MOBILE CONTROLS */}
            {isMobile && (
              <div className="flex items-center gap-2 shrink-0">
                <ThemeToggle />
                <button
                  className="p-2 text-foreground border-2 border-transparent hover:border-foreground transition-all"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {(isMenuOpen && isMobile) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 md:top-20 left-0 right-0 z-50 bg-background border-b-2 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)]"
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
        title={PRIVATE_REEL.title}
      />
    </>
  )
}
