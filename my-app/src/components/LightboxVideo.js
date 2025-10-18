import React from 'react'

export function toEmbedSrc(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube watch or youtu.be
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      // e.g., /shorts/<id>
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts[0] === 'shorts' && parts[1]) return `https://www.youtube.com/embed/${parts[1]}`
    }
    if (host.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    // Vimeo
    if (host.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`
    }

    return url
  } catch {
    return url
  }
}

export default function LightboxVideo({ open, onClose, src, title }) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[92vw] max-w-5xl aspect-video bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Close"
          className="absolute -top-10 right-0 text-white/80 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <iframe
          title={title || 'Trailer'}
          src={src}
          width="100%"
          height="100%"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    </div>
  )
}

