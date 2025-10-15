import React from 'react'
import Reveal from './Reveal'

const projects = [
    {
      title: "The Cultural Center",
      image: "https://picsum.photos/id/1080/800/600",
      description: "A modern cultural hub designed for community engagement",
      imdb: "https://www.imdb.com/",
      trailer: "https://www.youtube.com/",
    },
    {
      title: "Green Spacing",
      image: "https://picsum.photos/id/1082/800/600",
      description: "Sustainable architecture integrated with natural landscapes",
      imdb: "https://www.imdb.com/",
      trailer: "https://www.youtube.com/",
    },
    {
      title: "Float House",
      image: "https://picsum.photos/id/1081/800/600",
      description: "Innovative residential design with floating elements",
      imdb: "https://www.imdb.com/",
      trailer: "https://www.youtube.com/",
    }
]

export default function Projects() {
  const gap = 24 // px (Tailwind gap-6 / mr-6)
  const visible = 2
  const containerRef = React.useRef(null)
  const trackRef = React.useRef(null)
  const slideRef = React.useRef(null)
  const [slideWidth, setSlideWidth] = React.useState(0)

  const withClones = React.useMemo(() => {
    if (projects.length === 0) return []
    const startClones = projects.slice(-visible)
    const endClones = projects.slice(0, visible)
    return [...startClones, ...projects, ...endClones]
  }, [])

  const [index, setIndex] = React.useState(visible) // leftmost visible
  const [enableTransition, setEnableTransition] = React.useState(true)

  const measure = React.useCallback(() => {
    const contEl = containerRef.current
    if (!contEl) return
    const containerWidth = contEl.getBoundingClientRect().width
    // Two visible slides with a single gap between them
    const width = Math.max(0, (containerWidth - gap) / visible)
    setSlideWidth(width)
  }, [])

  React.useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const offset = React.useMemo(() => {
    if (!slideWidth) return 0
    return index * (slideWidth + gap)
  }, [slideWidth, index])

  const next = React.useCallback(() => setIndex((i) => i + 1), [])
  const prev = React.useCallback(() => setIndex((i) => i - 1), [])

  const onTransitionEnd = React.useCallback(() => {
    const origLen = projects.length
    const total = withClones.length
    if (index >= origLen + visible) {
      setEnableTransition(false)
      setIndex(visible)
      requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)))
    } else if (index < visible) {
      setEnableTransition(false)
      setIndex(origLen + visible - 1)
      requestAnimationFrame(() => requestAnimationFrame(() => setEnableTransition(true)))
    }
  }, [index, withClones.length])

  const imageMidY = React.useMemo(() => {
    // For aspect-[4/3] blocks: height = slideWidth * 3/4
    return slideWidth ? (slideWidth * 3) / 4 / 2 : 0
  }, [slideWidth])

  return (
    <section id="projects" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="text-left mb-16">
          <h2 className="text-6xl md:text-7xl font-light text-black mb-4">Projects</h2>
        </Reveal>

        {/* Slider viewport */}
        <div ref={containerRef} className="relative overflow-hidden select-none">
          {/* Track */}
          <div
            ref={trackRef}
            onTransitionEnd={onTransitionEnd}
            className="flex items-stretch will-change-transform"
            style={{
              transform: `translateX(${-offset}px)`,
              transition: enableTransition ? 'transform 700ms ease' : 'none',
            }}
          >
            {withClones.map((project, i) => (
              <div
                key={i}
                ref={i === visible ? slideRef : null}
                className="flex-none mr-6 group cursor-pointer"
                style={{ width: slideWidth ? `${slideWidth}px` : undefined }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
                <h3 className="text-3xl md:text-4xl font-medium text-black mb-2">{project.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                <div className="mt-3 space-x-6">
                  <a href={project.trailer} target="_blank" rel="noopener noreferrer" className="font-bold underline text-black">Trailer</a>
                  <a href={project.imdb} target="_blank" rel="noopener noreferrer" className="font-bold underline text-black">IMDb</a>
                </div>
              </div>
            ))}
          </div>

          {/* Controls styled like provided arrows, positioned visibly */}
          <button
            className="user-items-list-carousel__arrow-button user-items-list-carousel__arrow-button--left preFade fadeIn absolute left-4 z-20 flex items-center justify-center text-black"
            aria-label="Previous"
            onClick={prev}
            style={{ top: imageMidY, transform: 'translateY(-50%)', transitionTimingFunction: 'ease', transitionDuration: '0.9s', transitionDelay: '0.2s' }}
          >
            <svg className="user-items-list-carousel__arrow-icon h-6 w-[44px]" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
              <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
              <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M42.8633 9.18125L3.37868 9.18125" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            </svg>
          </button>
          <button
            className="user-items-list-carousel__arrow-button user-items-list-carousel__arrow-button--right preFade fadeIn absolute right-4 z-20 flex items-center justify-center text-black"
            aria-label="Next"
            onClick={next}
            style={{ top: imageMidY, transform: 'translateY(-50%)', transitionTimingFunction: 'ease', transitionDuration: '0.9s', transitionDelay: '0.2s' }}
          >
            <svg className="user-items-list-carousel__arrow-icon h-6 w-[44px]" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
              <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M34.0935 1.39116L41.8779 9.17556L34.0935 16.96" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
              <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M41.1213 9.18125L1.63672 9.18125" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
