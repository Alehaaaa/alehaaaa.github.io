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

