import { useMemo, useState } from 'react'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import Reveal from './Reveal'
import { MAIN_REEL } from '../data/projects'
import { PROFILE } from '../data/profile'

export default function About() {
  const [reelOpen, setReelOpen] = useState(false)
  const reelUrl = MAIN_REEL.url
  const reelSrc = useMemo(() => toEmbedSrc(reelUrl) || reelUrl, [reelUrl])

  const openReel = (e) => {
    e.preventDefault()
    setReelOpen(true)
  }

  return (
    <>
      <section id="about" className="py-40 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <Reveal>
            <h2 className="text-6xl lg:text-7xl font-light text-foreground mb-10">About</h2>
          </Reveal>
          <div className="lg:flex lg:items-start lg:gap-24">
            <div className="lg:flex-1">
              {PROFILE.bio.map((paragraph, i) => (
                <Reveal key={i} delay={100 + (i * 50)}>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={250}>
              <div className="mt-12 lg:mt-0 lg:ml-auto w-full max-w-full lg:max-w-sm flex gap-4 lg:gap-5 lg:items-end flex-col md:flex-row lg:flex-col">
                <a
                  href={PROFILE.links.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 lg:flex-none inline-flex justify-center w-full px-8 py-4 border-2 border-[color:var(--neo-border)] bg-background text-xl lg:text-2xl font-medium text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  CV
                </a>
                <a
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 lg:flex-none inline-flex justify-center w-full px-8 py-4 border-2 border-[color:var(--neo-border)] bg-background text-xl lg:text-2xl font-medium text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  LinkedIn
                </a>
                <button
                  type="button"
                  onClick={openReel}
                  className="flex-1 lg:flex-none inline-flex justify-center w-full px-8 py-4 border-2 border-[color:var(--neo-border)] bg-background text-xl lg:text-2xl font-medium text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer"
                >
                  Reel
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <LightboxVideo open={reelOpen} onClose={() => setReelOpen(false)} src={reelSrc} title={MAIN_REEL.title} />
    </>
  )
}

