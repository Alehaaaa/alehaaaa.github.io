import React from 'react'

export default function LightboxImage({ open, onClose, src, alt }) {
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
      <div
        className="relative inline-block"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close"
          className="absolute -top-10 right-0 text-white/90 hover:text-white px-3 py-1"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt || ''}
          className="block max-w-[92vw] max-h-[90vh] w-auto h-auto object-contain"
        />
      </div>
    </div>
  )
}
