const isSafeUrl = (value) => {
  if (!value || /[\u0000-\u001F\u007F\s]/.test(value)) return false

  try {
    const url = new URL(value)
    return ['http:', 'https:', 'mailto:', 'data:', 'blob:'].includes(url.protocol)
  } catch {
    return false
  }
}

function ExternalLink({ href, children }) {
  if (!isSafeUrl(href)) return children

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline font-bold hover:text-muted-foreground transition-colors"
    >
      {children}
    </a>
  )
}

function MediaQuote({ image, alt, quote, cite }) {
  return (
    <div className="my-12 max-w-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
      <div className="flex justify-center md:justify-start">
        <img
          src={image}
          alt={alt || ''}
          className="w-full max-w-[240px] h-auto block select-none"
          loading="lazy"
        />
      </div>
      <blockquote className="text-right not-italic">
        <span className="block text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-500 dark:text-zinc-400">
          {quote}
        </span>
        {cite && (
          <span className="block text-xl font-bold italic text-zinc-400 dark:text-zinc-500 mt-2">
            {cite}
          </span>
        )}
      </blockquote>
    </div>
  )
}

export const mdxComponents = {
  a: ExternalLink,
  MediaQuote,
}
