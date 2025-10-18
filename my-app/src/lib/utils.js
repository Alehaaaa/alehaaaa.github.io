// Minimal className merge utility compatible with objects/arrays/strings
export function cn(...args) {
  const classes = []
  const push = (val) => {
    if (!val) return
    if (typeof val === 'string') classes.push(val)
    else if (Array.isArray(val)) val.forEach(push)
    else if (typeof val === 'object') {
      for (const key in val) if (Object.hasOwn(val, key) && val[key]) classes.push(key)
    }
  }
  args.forEach(push)
  return classes.join(' ')
}

// Derive the app's public URL base at runtime by inspecting link tags
export function getPublicUrlBase() {
  const env = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) || ''
  if (env) return env
  try {
    const manifestEl = document.querySelector('link[rel="manifest"][href]')
    if (manifestEl) {
      const href = manifestEl.getAttribute('href') || ''
      if (!href.includes('%PUBLIC_URL%')) {
        const u = new URL(href, window.location.href)
        const base = u.pathname.replace(/\/manifest\.json$/, '')
        if (base) return base
      }
    }
    const iconEl = document.querySelector('link[rel="icon"][href]')
    if (iconEl) {
      const href = iconEl.getAttribute('href') || ''
      if (!href.includes('%PUBLIC_URL%')) {
        const u = new URL(href, window.location.href)
        const base = u.pathname.replace(/\/favicon\.ico$/, '')
        if (base) return base
      }
    }
  } catch (_) {}
  return ''
}

// Convert a path from projects.json (which may start with 'public/') into a usable URL
export function toPublicUrl(p) {
  if (!p) return p
  if (/^https?:\/\//i.test(p)) return p
  const withoutPublic = p.replace(/^public\//, '')
  const base = getPublicUrlBase()
  const rel = withoutPublic.replace(/^\//, '')
  const baseClean = (base || '').replace(/\/$/, '')
  return baseClean ? `${baseClean}/${rel}` : `/${rel}`
}
