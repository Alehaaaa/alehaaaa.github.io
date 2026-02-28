import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'

export default function LightboxImage({ open, onClose, src, alt, description }) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 pointer-events-auto">
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
            className="relative z-10 w-full max-w-6xl h-[90vh] max-h-[90vh] bg-background border-2 border-[color:var(--neo-border)] shadow-[8px_8px_0px_0px_var(--neo-shadow)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Controls */}
            <div className="flex items-center justify-end px-4 py-3 border-b-2 border-[color:var(--neo-border)] bg-background shrink-0">
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground hover:text-background transition-colors border-2 border-transparent hover:border-[color:var(--neo-border)] rounded-none cursor-pointer"
                aria-label="Close"
              >
                <X size={24} className="cursor-pointer" />
              </button>
            </div>

            {/* Image Area */}
            <div className="flex-1 overflow-hidden bg-muted flex items-center justify-center p-2 md:p-4 min-h-0">
              <img
                src={src}
                alt={alt || ''}
                className="max-w-full max-h-full object-contain block"
              />
            </div>

            {/* Footer / Description */}
            {(description || alt) && (
              <div className="p-6 bg-background border-t-2 border-[color:var(--neo-border)] shrink-0">
                <p className="text-lg font-medium">{alt}</p>
                {description && <p className="text-muted-foreground mt-2">{description}</p>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
