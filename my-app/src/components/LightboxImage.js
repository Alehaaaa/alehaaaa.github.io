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

  React.useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const prevBodyOverflow = body.style.overflow
    const prevHtmlOverflow = documentElement.style.overflow
    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prevBodyOverflow
      documentElement.style.overflow = prevHtmlOverflow
    }
  }, [open])

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
          className="absolute top-0 right-0 -translate-y-full text-white/90 hover:text-white text-3xl md:text-4xl leading-none px-2 py-1"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt || ''}
          className="block max-w-[92vw] max-h-[90vh] w-auto h-auto object-contain"
        />
        {alt ? (
          <div className="mt-4 text-left text-white text-2xl md:text-3xl font-light leading-snug max-w-[92vw]">
            {alt}
          </div>
        ) : null}
      </div>
    </div>
  )
}
