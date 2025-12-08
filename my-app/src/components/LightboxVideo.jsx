import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'

export function toEmbedSrc(url) {
  // ... (keeping existing logic, just showing context for replace)
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    // YouTube watch or youtu.be
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
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

export default function LightboxVideo({ open, onClose, src, title, description }) {
  useScrollLock(open)

  React.useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && src && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="relative z-10 w-full max-w-6xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Controls */}
            <div className="flex items-center justify-end px-4 py-3 border-b-2 border-black bg-white">
              <button
                onClick={onClose}
                className="p-2 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black rounded-none cursor-pointer"
                aria-label="Close"
              >
                <X size={24} className="cursor-pointer" />
              </button>
            </div>

            {/* Video Area */}
            <div className="flex-1 bg-black aspect-video w-full">
              <iframe
                title={title || 'Trailer'}
                src={src}
                width="100%"
                height="100%"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Footer */}
            {(title || description) && (
              <div className="p-6 bg-white border-t-2 border-black">
                {title && <p className="text-lg font-medium">{title}</p>}
                {description && <p className="text-gray-600 mt-2">{description}</p>}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
