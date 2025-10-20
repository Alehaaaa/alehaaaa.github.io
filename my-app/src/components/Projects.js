import React from 'react'
import Reveal from './Reveal'
import { projects } from '../lib/utils'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import LightboxImage from './LightboxImage'

const MOVE_THRESHOLD = 8

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function Projects() {
  const gap = 24 // px (Tailwind gap-6 / mr-6)
  const totalProjects = projects.length
  const pageRef = React.useRef(null)
  const viewportRef = React.useRef(null)

  const [videoOpen, setVideoOpen] = React.useState(false)
  const [videoSrc, setVideoSrc] = React.useState(null)
  const [videoTitle, setVideoTitle] = React.useState('')
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)
  const [imageAlt, setImageAlt] = React.useState('')

  const [layout, setLayout] = React.useState({
    visible: 2,
    slideWidth: 0,
    leadingPadding: 0,
    trailingPadding: 0,
  })
  const [index, setIndex] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [scrollPosition, setScrollPosition] = React.useState(0)

  const dragRef = React.useRef({ active: false, startX: 0, startScroll: 0, moved: false, lightbox: null })
  const suppressClickRef = React.useRef(false)
  const animationRef = React.useRef(null)

  const { visible, slideWidth, leadingPadding, trailingPadding } = layout
  const stepSize = React.useMemo(() => (slideWidth ? slideWidth + gap : 0), [slideWidth, gap])
  const maxIndex = React.useMemo(() => Math.max(0, totalProjects - visible), [visible, totalProjects])
  const imageMidY = React.useMemo(() => (slideWidth ? (slideWidth * 3) / 4 / 2 : 0), [slideWidth])
  const trailingInset = React.useMemo(() => (visible > 1 ? gap : 0), [visible, gap])
  const focusPosition = React.useMemo(() => {
    if (!stepSize) return index
    const maxPosition = Math.max(0, totalProjects - 1)
    return clamp(scrollPosition / stepSize, 0, maxPosition)
  }, [scrollPosition, stepSize, index, totalProjects])

  const measure = React.useCallback(() => {
    const vp = viewportRef.current
    const page = pageRef.current
    if (!vp || !page) return

    const vpWidth = vp.getBoundingClientRect().width
    const cs = window.getComputedStyle(page)
    const basePadding = parseFloat(cs.paddingLeft) || 0

    let newVisible
    if (vpWidth < 768) {
      newVisible = 1
    } else if (vpWidth < 1500) {
      newVisible = 2
    } else {
      newVisible = 3
    }

    let width = 0
    let leading = basePadding
    let trailing = basePadding

    if (newVisible === 1) {
      const contentWidth = Math.max(0, vpWidth - (basePadding + gap) * 2)
      width = Math.max(0, contentWidth)
      leading = basePadding + gap
      trailing = basePadding + gap
    } else if (newVisible === 2) {
      const contentWidth = Math.max(0, vpWidth - basePadding * 2)
      width = Math.max(0, (contentWidth - gap) / 2)
    } else {
      const contentWidth = Math.max(0, vpWidth - basePadding * 2)
      width = Math.max(0, (contentWidth - gap * 2) / 3)
    }

    setLayout((prev) => {
      if (
        prev.visible === newVisible &&
        prev.slideWidth === width &&
        prev.leadingPadding === leading &&
        prev.trailingPadding === trailing
      ) {
        return prev
      }
      return { visible: newVisible, slideWidth: width, leadingPadding: leading, trailingPadding: trailing }
    })

    const newMax = Math.max(0, totalProjects - newVisible)
    const step = width + gap
    setIndex((prev) => {
      const next = clamp(prev, 0, newMax)
      if (step > 0) {
        requestAnimationFrame(() => {
          const el = viewportRef.current
          if (!el) return
          el.scrollTo({ left: next * step, behavior: 'auto' })
          setScrollPosition(next * step)
        })
      }
      return next
    })
  }, [gap, totalProjects])

  React.useLayoutEffect(() => {
    measure()
  }, [measure])

  React.useEffect(() => {
    const vp = viewportRef.current
    if (!vp || !stepSize) return

    let frame = 0
    const syncIndex = () => {
      frame = 0
      if (dragRef.current.active && dragRef.current.moved) return
      const raw = Math.round(vp.scrollLeft / stepSize)
      const clamped = clamp(raw, 0, maxIndex)
      setIndex((prev) => (prev === clamped ? prev : clamped))
      setScrollPosition(vp.scrollLeft)
    }
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(syncIndex)
      }
    }

    vp.addEventListener('scroll', onScroll, { passive: true })
    syncIndex()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      vp.removeEventListener('scroll', onScroll)
    }
  }, [maxIndex, stepSize])

  React.useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure())
      ro.observe(vp)
      const page = pageRef.current
      if (page) ro.observe(page)
    }
    window.addEventListener('resize', measure)
    return () => {
      if (ro) ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const cancelScrollAnimation = React.useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current.frame)
      animationRef.current = null
      const vp = viewportRef.current
      if (vp) {
        setScrollPosition(vp.scrollLeft)
      }
    }
  }, [])

  const openImageLightbox = React.useCallback((src, title) => {
    setImageSrc(src)
    setImageAlt(title || '')
    setImageOpen(true)
  }, [])

  const animateScrollTo = React.useCallback((target, duration = 280) => {
    const vp = viewportRef.current
    if (!vp) return
    const start = vp.scrollLeft
    const distance = target - start
    if (Math.abs(distance) < 1 || duration <= 0) {
      vp.scrollLeft = target
      setScrollPosition(target)
      return
    }
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const startTime = performance.now()
    const step = (now) => {
      const progress = Math.min(1, Math.max(0, (now - startTime) / duration))
      const eased = ease(progress)
      const next = start + distance * eased
      vp.scrollLeft = next
      setScrollPosition(next)
      if (progress < 1) {
        animationRef.current = { frame: requestAnimationFrame(step) }
      } else {
        setScrollPosition(target)
        animationRef.current = null
      }
    }
    animationRef.current = { frame: requestAnimationFrame(step) }
  }, [])

  const scrollToIndex = React.useCallback(
    (targetIndex, behavior = 'smooth') => {
      const vp = viewportRef.current
      if (!vp || !stepSize) return
      const clampedIndex = Math.min(maxIndex, Math.max(0, targetIndex))
      const target = clampedIndex * stepSize
      setIndex(clampedIndex)
      if (behavior === 'instant') {
        cancelScrollAnimation()
        vp.scrollLeft = target
        setScrollPosition(target)
        return
      }
      cancelScrollAnimation()
      animateScrollTo(target, 240)
    },
    [animateScrollTo, cancelScrollAnimation, maxIndex, stepSize]
  )

  const endDrag = React.useCallback((didMove) => {
    dragRef.current.active = false
    dragRef.current.moved = false
    suppressClickRef.current = didMove
    setIsDragging(false)
  }, [])

  const onPointerDown = React.useCallback((e) => {
    const vp = viewportRef.current
    if (!vp) return
    if (typeof e.button === 'number' && e.button !== 0) return
    const target = e.target
    if (target && typeof target.closest === 'function' && target.closest('a,button,input,textarea,select')) {
      return
    }
    const lightboxTarget = target && typeof target.closest === 'function' ? target.closest('[data-lightbox-src]') : null

    cancelScrollAnimation()
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: vp.scrollLeft,
      moved: false,
      lightbox: lightboxTarget
        ? {
          src: lightboxTarget.getAttribute('data-lightbox-src') || '',
          title: lightboxTarget.getAttribute('data-lightbox-title') || '',
        }
        : null,
    }
    setScrollPosition(vp.scrollLeft)
    suppressClickRef.current = false
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch { }
  }, [cancelScrollAnimation])

  const onPointerMove = React.useCallback((e) => {
    if (!dragRef.current.active) return
    const vp = viewportRef.current
    if (!vp) return

    const dx = e.clientX - dragRef.current.startX
    if (!dragRef.current.moved && Math.abs(dx) > MOVE_THRESHOLD) {
      dragRef.current.moved = true
      setIsDragging(true)
      dragRef.current.lightbox = null
    }
    if (!dragRef.current.moved) return
    e.preventDefault()

    const maxScroll = Math.max(0, vp.scrollWidth - vp.clientWidth)
    const nextScroll = clamp(dragRef.current.startScroll - dx, 0, maxScroll)
    vp.scrollLeft = nextScroll
    setScrollPosition(nextScroll)
  }, [])

  const settleAfterDrag = React.useCallback(() => {
    const vp = viewportRef.current
    if (!vp || !stepSize) return
    const targetIndex = Math.round(vp.scrollLeft / stepSize)
    scrollToIndex(targetIndex)
  }, [scrollToIndex, stepSize])

  const onPointerUp = React.useCallback((e) => {
    if (!dragRef.current.active) return
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch { }
    const didMove = dragRef.current.moved
    const lightbox = dragRef.current.lightbox
    endDrag(didMove)
    if (didMove) {
      settleAfterDrag()
    } else if (lightbox && lightbox.src) {
      openImageLightbox(lightbox.src, lightbox.title)
    }
    dragRef.current.lightbox = null
  }, [endDrag, settleAfterDrag, openImageLightbox])

  const onPointerCancel = React.useCallback(() => {
    if (!dragRef.current.active) return
    const didMove = dragRef.current.moved
    dragRef.current.lightbox = null
    endDrag(didMove)
    if (didMove) settleAfterDrag()
  }, [endDrag, settleAfterDrag])

  const onClickCapture = React.useCallback((e) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    e.preventDefault()
    e.stopPropagation()
  }, [])

  React.useEffect(() => {
    return () => {
      cancelScrollAnimation()
    }
  }, [cancelScrollAnimation])

  const next = React.useCallback(() => scrollToIndex(index + 1), [scrollToIndex, index])
  const prev = React.useCallback(() => scrollToIndex(index - 1), [scrollToIndex, index])

  return (
    <section id="projects" className="py-40 bg-white" style={{ overflowX: 'hidden' }}>
      {/* Header in normal page flow */}
      <div ref={pageRef} className="max-w-7xl mx-auto px-4">
        <Reveal className="text-left mb-16">
          <h2 className="text-6xl md:text-7xl font-light text-black mb-4">Projects</h2>
        </Reveal>
      </div>

      {/* Scrollable viewport within main container margins */}
      <div className="relative">
        <div
          ref={viewportRef}
          className="overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollSnapType: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: `${leadingPadding}px`,
            scrollPaddingRight: `${trailingPadding + trailingInset}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onClickCapture={onClickCapture}
        >
          {/* Track */}
          <div
            className="flex items-stretch"
            style={{
              paddingLeft: `${leadingPadding}px`,
              paddingRight: `${trailingPadding + trailingInset}px`,
              gap: `${gap}px`,
            }}
          >
            {projects.map((project, i) => {
              const windowStart = focusPosition
              const windowEnd = focusPosition + Math.max(visible - 1, 0)
              let distance = 0
              if (i < windowStart) {
                distance = windowStart - i
              } else if (i > windowEnd) {
                distance = i - windowEnd
              }
              const opacity = clamp(1 - Math.min(distance, 1) * 0.4, 0.6, 1)
              const companyUrl = project.companyUrl
              const companyLabel = project.companyDisplayName || project.companyName || ''
              return (
                <div
                  key={i}
                  className="flex-none group"
                  style={{
                    width: slideWidth ? `${slideWidth}px` : undefined,
                    opacity,
                    transition: 'opacity 160ms ease',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                  }}
                >
                  <div
                    className="aspect-[4/3] overflow-hidden mb-6 bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    role="button"
                    tabIndex={0}
                    data-lightbox-src={project.image}
                    data-lightbox-title={project.title || ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openImageLightbox(project.image, project.title)
                      }
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-medium text-black mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-xl leading-relaxed">{[project.type, project.role].filter(Boolean).join(' \u00B7 ')}</p>
                  <div className="mt-3 flex items-center xl:gap-8 md:gap-5 gap-4 text-black">
                    {project.trailer && (
                      <a
                        href={project.trailer}
                        onClick={(e) => {
                          e.preventDefault()
                          const preferNewTab = visible === 1 || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(orientation: portrait)').matches)
                          if (preferNewTab) {
                            window.open(project.trailer, '_blank', 'noopener,noreferrer')
                            return
                          }
                          const embed = toEmbedSrc(project.trailer)
                          if (embed) {
                            setVideoSrc(embed)
                            setVideoTitle(`Trailer for ${project.title}`)
                            setVideoOpen(true)
                          } else {
                            window.open(project.trailer, '_blank', 'noopener,noreferrer')
                          }
                        }}
                        className="font-medium text-xl underline"
                      >
                        Trailer
                      </a>
                    )}
                    {project.imdb && (
                      <a href={project.imdb} target="_blank" rel="noopener noreferrer" className="font-medium text-xl underline">IMDb</a>
                    )}
                    {companyUrl && (
                      <>
                        <span className="mx-1 text-black">|</span>
                        <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="text-xl no-underline font-light hover:opacity-80">{companyLabel || 'Company'}</a>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Controls */}
        <button
          className="user-items-list-carousel__arrow-button user-items-list-carousel__arrow-button--left absolute left-0 z-20 flex items-center justify-center text-black disabled:opacity-40"
          aria-label="Previous"
          onClick={prev}
          disabled={index === 0}
          style={{ top: imageMidY, transform: 'translateY(-50%)', height: '120%', width: '7.5%' }}
        >
          <svg className="user-items-list-carousel__arrow-icon h-6 w-[44px]" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
            <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M42.8633 9.18125L3.37868 9.18125" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          </svg>
        </button>
        <button
          className="user-items-list-carousel__arrow-button user-items-list-carousel__arrow-button--right absolute right-0 z-20 flex items-center justify-center text-black disabled:opacity-40"
          aria-label="Next"
          onClick={next}
          disabled={index === maxIndex}
          style={{ top: imageMidY, transform: 'translateY(-50%)', height: '120%', width: '7.5%' }}
        >
          <svg className="user-items-list-carousel__arrow-icon h-6 w-[44px]" viewBox="0 0 44 18" xmlns="http://www.w3.org/2000/svg">
            <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M34.0935 1.39116L41.8779 9.17556L34.0935 16.96" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
            <path className="user-items-list-carousel__arrow-icon-foreground user-items-list-carousel__arrow-icon-path" d="M41.1213 9.18125L1.63672 9.18125" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          </svg>
        </button>
      </div>
      <LightboxVideo open={videoOpen} onClose={() => setVideoOpen(false)} src={videoSrc} title={videoTitle} />
      <LightboxImage open={imageOpen} onClose={() => setImageOpen(false)} src={imageSrc} alt={`Poster for ${imageAlt}`} />
    </section>
  )
}
