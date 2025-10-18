import React from 'react'
import Reveal from './Reveal'
import projectsData from '../projects.json'
import { toPublicUrl } from '../lib/utils'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import LightboxImage from './LightboxImage'

const projects = projectsData.projects
  .filter((p) => !p.disabled)
  .map((p) => ({
  title: p.title,
  image: toPublicUrl(p.poster),
  description: [p.type, p.role].filter(Boolean).join(' · '),
  imdb: p.imdbLink,
  trailer: p.trailerLink,
}))

export default function Projects() {
  const gap = 24 // px (Tailwind gap-6 / mr-6)
  const [visible, setVisible] = React.useState(2)
  const pageRef = React.useRef(null) // measures main container padding (main margins)
  const viewportRef = React.useRef(null) // slider viewport within main container
  const trackRef = React.useRef(null)
  const [slideWidth, setSlideWidth] = React.useState(0)
  const [gutter, setGutter] = React.useState(0)

  const [index, setIndex] = React.useState(0) // non-infinite, start at 0
  const maxIndex = Math.max(0, projects.length - visible)

  // Drag state (mouse + touch via Pointer Events)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState(0)
  const dragRef = React.useRef({ startX: 0, startOffset: 0, moved: false })

  const [videoOpen, setVideoOpen] = React.useState(false)
  const [videoSrc, setVideoSrc] = React.useState(null)
  const [videoTitle, setVideoTitle] = React.useState('')
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)
  const [imageAlt, setImageAlt] = React.useState('')

  const measure = React.useCallback(() => {
    const vp = viewportRef.current
    const page = pageRef.current
    if (!vp || !page) return
    const vpWidth = vp.getBoundingClientRect().width
    const cs = window.getComputedStyle(page)
    const paddingLeft = parseFloat(cs.paddingLeft) || 0 // equals main margin width (px-4 override)
    const newVisible = vpWidth < 768 ? 1 : 2
    // Use a dynamic side peek for balance, clamped to sensible range
    let width
    if (newVisible === 2) {
      // Two centered slides filling the content area evenly (no extra peeks)
      const contentWidth = Math.max(0, vpWidth - paddingLeft * 2)
      width = Math.max(0, (contentWidth - gap) / 2)
    } else {
      // One centered slide filling the content area
      const contentWidth = Math.max(0, vpWidth - paddingLeft * 2)
      width = Math.max(0, contentWidth)
    }
    setVisible(newVisible)
    setSlideWidth(width)
    setGutter(paddingLeft)
    // Clamp index if needed when layout changes
    const newMax = Math.max(0, projects.length - newVisible)
    setIndex((i) => Math.min(i, newMax))
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

  const next = React.useCallback(() => setIndex((i) => Math.min(i + 1, maxIndex)), [maxIndex])
  const prev = React.useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  const imageMidY = React.useMemo(() => (slideWidth ? (slideWidth * 3) / 4 / 2 : 0), [slideWidth])

  // Derived values for dragging
  const stepSize = slideWidth + gap
  const maxOffset = Math.max(0, maxIndex * stepSize)
  const SNAP_RATIO = 0.18 // fraction of a slide to advance
  const MOVE_THRESHOLD = 8 // px before we treat it as a drag

  // Track whether we've exceeded the move threshold in this gesture
  const suppressClickRef = React.useRef(false)

  // Read the current visual translateX (in px) from the track element
  const getCurrentOffset = React.useCallback(() => {
    const el = trackRef.current
    if (!el) return offset
    try {
      const style = window.getComputedStyle(el)
      const t = style.transform || style.webkitTransform || 'none'
      if (!t || t === 'none') return offset
      if (t.startsWith('matrix3d(')) {
        const parts = t.slice(9, -1).split(',').map(parseFloat)
        const tx = parts[12] || 0
        return Math.max(0, -tx)
      }
      if (t.startsWith('matrix(')) {
        const parts = t.slice(7, -1).split(',').map(parseFloat)
        const tx = parts[4] || 0
        return Math.max(0, -tx)
      }
    } catch { }
    return offset
  }, [offset])

  const onPointerDown = React.useCallback((e) => {
    // Only left mouse button or touch/pen
    if (typeof e.button === 'number' && e.button !== 0) return
    if (!slideWidth) return
    // Do not initiate dragging when clicking interactive controls
    const tgt = e.target
    if (tgt && (tgt.closest && (tgt.closest('a,button')))) return
    const current = getCurrentOffset()
    const startIdx = stepSize > 0 ? Math.round(current / stepSize) : index
    dragRef.current = { startX: e.clientX, startOffset: current, moved: false, startIndex: startIdx }
    setDragOffset(current)
    setIsDragging(true)
  }, [getCurrentOffset, slideWidth, stepSize, index])

  const onPointerMove = React.useCallback((e) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    let nextOffset = dragRef.current.startOffset - dx
    if (nextOffset < 0) nextOffset = 0
    if (nextOffset > maxOffset) nextOffset = maxOffset
    if (!dragRef.current.moved && Math.abs(dx) > MOVE_THRESHOLD) {
      dragRef.current.moved = true
      try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId) } catch { }
    }
    setDragOffset(nextOffset)
  }, [isDragging, maxOffset])

  const endDrag = React.useCallback(() => {
    if (!isDragging) return
    // Snap using a shorter threshold than 50%
    const origin = dragRef.current.startIndex || 0
    let clamped = origin
    if (stepSize > 0) {
      const movedFrac = (dragOffset - (dragRef.current.startOffset || 0)) / stepSize
      if (movedFrac > SNAP_RATIO) clamped = origin + 1
      else if (movedFrac < -SNAP_RATIO) clamped = origin - 1
      clamped = Math.max(0, Math.min(clamped, maxIndex))
    }
    setIndex(clamped)
    setIsDragging(false)
    // Remember if this gesture moved enough to count as a drag
    suppressClickRef.current = !!dragRef.current.moved
    dragRef.current.moved = false
  }, [dragOffset, isDragging, maxIndex, setIndex, stepSize])

  const onPointerUp = React.useCallback((e) => {
    const wasDrag = suppressClickRef.current
    endDrag()
    if (wasDrag) {
      // Prevent the synthetic click from firing after a drag
      try { e.preventDefault() } catch {}
      try { e.stopPropagation() } catch {}
      suppressClickRef.current = false
    }
  }, [endDrag])
  const onPointerCancel = React.useCallback(() => endDrag(), [endDrag])
  // No global click capture; we suppress click via pointerup when needed

  return (
    <section id="projects" className="py-40 bg-white" style={{ overflowX: 'hidden' }}>
      {/* Header in normal page flow */}
      <div ref={pageRef} className="max-w-7xl mx-auto px-4">
        <Reveal className="text-left mb-16">
          <h2 className="text-6xl md:text-7xl font-light text-black mb-4">Projects</h2>
        </Reveal>
      </div>

      {/* Slider viewport within main container margins */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden select-none"
        style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
          style={{
            paddingLeft: gutter,
            paddingRight: gutter,
            gap: `${gap}px`,
            transform: `translateX(${- (isDragging ? dragOffset : offset)}px)`,
            transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          }}
        >
          {projects.map((project, i) => {
            const isFocused = i >= index && i < index + visible
            const source = (projectsData.projects && projectsData.projects[i]) || {}
            const companyUrl = source.companyLink
            let companyText = source.companyName || ''
            if (!companyText && companyUrl) {
              try {
                const u = new URL(companyUrl)
                companyText = u.hostname.replace(/^www\./, '')
              } catch { }
            }
            return (
              <div
                key={i}
                className="flex-none group"
                style={{ width: slideWidth ? `${slideWidth}px` : undefined, opacity: isFocused ? 1 : 0.7, transition: 'opacity 300ms ease' }}
              >
              <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover cursor-pointer"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={() => { setImageSrc(project.image); setImageAlt(project.title || ''); setImageOpen(true) }}
                />
              </div>
                <h3 className="text-3xl md:text-4xl font-medium text-black mb-2">{project.title}</h3>
                <p className="text-gray-600 text-xl leading-relaxed">{[source.type, source.role].filter(Boolean).join(' · ')}</p>
                <div className="mt-3 flex items-center gap-6 text-black">
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
                    <a href={project.imdb} target="_blank" rel="noopener noreferrer"
                    className="font-medium text-xl underline">IMDb</a>
                  )}
                  {companyUrl && (
                    <>
                      <span className="mx-1 text-black">|</span>
                      <a href={companyUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xl no-underline font-light hover:opacity-80">{companyText || 'Company'}</a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
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
