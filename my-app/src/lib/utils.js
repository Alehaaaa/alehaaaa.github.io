import projectsData from '../projects.json'
import projectDetails from '../data/projectDetails'

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

const slugify = (value, fallback) => {
  const base = (value || fallback || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || fallback || 'project'
}

const parseTimelinePoint = (point) => {
  if (!point || typeof point !== 'object') return null
  const month = typeof point.month === 'string' ? point.month.trim() : ''
  const rawYear =
    typeof point.year === 'number'
      ? point.year
      : typeof point.year === 'string'
        ? Number(point.year)
        : NaN
  const year = Number.isFinite(rawYear) ? rawYear : null
  if (!month && year === null) return null
  return { month, year }
}

const parseTimeline = (timeline) => {
  if (!timeline || typeof timeline !== 'object') return null
  const start = parseTimelinePoint(timeline.start)
  const end = parseTimelinePoint(timeline.end)
  if (!start && !end) return null
  return {
    start,
    end: end || start || null,
  }
}

const deriveYearsFromTimeline = (timeline) => {
  if (!timeline) return []
  const years = []
  const push = (val) => {
    if (!Number.isFinite(val)) return
    if (!years.includes(val)) years.push(val)
  }
  push(timeline.start?.year ?? null)
  push(timeline.end?.year ?? null)
  return years.sort((a, b) => a - b)
}

export const projects = projectsData.projects
  .filter((item) => !item.disabled)
  .map((item, index) => {
    const rawCompanies = Array.isArray(item.companies) ? item.companies : []
    const fallbackNeeded =
      !rawCompanies.length && (item.companyName || item.companyUrl || item.companyLogo)
    const companiesSource = fallbackNeeded
      ? [
        {
          name: item.companyName,
          url: item.companyUrl,
          logo: item.companyLogo,
        },
      ]
      : rawCompanies

    const companies = companiesSource
      .map((company) => {
        if (!company || typeof company !== 'object') return null
        const url = company.url || ''
        const name = (company.name || '').trim()
        let displayName = (company.displayName || '').trim() || name
        if (!displayName && url) {
          try {
            const { hostname } = new URL(url)
            displayName = hostname.replace(/^www\./, '')
          } catch { }
        }
        const logo = toPublicUrl(company.logo)
        if (!name && !url && !logo) return null
        return {
          name,
          url,
          displayName,
          logo,
        }
      })
      .filter(Boolean)

    const primaryCompany = companies[0] || {}
    const companyUrl = primaryCompany.url || ''
    const companyName = primaryCompany.name || ''
    const companyDisplayName =
      primaryCompany.displayName ||
      (() => {
        if (companyName) return companyName
        if (!companyUrl) return ''
        try {
          const { hostname } = new URL(companyUrl)
          return hostname.replace(/^www\./, '')
        } catch {
          return ''
        }
      })()

    const timeline = parseTimeline(item.timeline)

    const yearsFromTimeline = deriveYearsFromTimeline(timeline)

    const yearsRaw = Array.isArray(item.year)
      ? item.year
      : typeof item.year === 'number'
        ? [item.year]
        : []
    const years = yearsRaw.length ? yearsRaw : yearsFromTimeline
    const slug = slugify(item.slug || item.title, `project-${index + 1}`)
    const detailOverrides = projectDetails[slug] || {}
    const detailSocials = Array.isArray(detailOverrides.socials) ? detailOverrides.socials : []
    const detailContent = Array.isArray(detailOverrides.content) ? detailOverrides.content : []
    return {
      title: item.title,
      image: toPublicUrl(item.poster),
      type: item.type,
      role: item.role,
      companyUrl,
      companyName,
      companyDisplayName,
      companyLogo: primaryCompany.logo || '',
      companies,
      years,
      timeline,
      imdb: item.imdbLink,
      trailer: item.trailerLink,
      slug,
      detail: {
        subtitle: detailOverrides.subtitle || '',
        content: detailContent,
        socials: detailSocials,
      },
    }
  })

export const projectsBySlug = projects.reduce((acc, project) => {
  acc[project.slug] = project
  return acc
}, {})

export const getProjectBySlug = (slug) => projectsBySlug[slug]
