import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { projects as sourceProjects } from '../projects'

export const cn = (...inputs) => twMerge(clsx(inputs))

// Master toggle to compress projects with future end dates into "Currently" (disabled for now)
export const COMPRESS_FUTURE_DATES = false

const slugify = (value, fallback) => {
  const base = (value || fallback || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || fallback || 'project'
}

export const toPublicUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  return p.replace(/^public\//, '/').replace(/^\/?/, '/')
}

// Returns true if the project should currently be shown as censored/upcoming.
// upcoming can be:
//   true           → always censored
//   "YYYY-MM-DD"   → censored until that date has passed
//   false/undefined → not upcoming
export const isUpcoming = (upcoming) => {
  if (!upcoming) return false
  if (upcoming === true) return true
  return new Date() < new Date(upcoming)
}

// Parse "YYYY-MM" → { year: number, month: number (1-indexed) }
const parseYM = (ym) => {
  if (!ym) return null
  const [year, month] = ym.split('-').map(Number)
  return { year, month }
}

const isFuture = (ym) => {
  const p = parseYM(ym)
  if (!p) return false
  // Past the end of that month
  return new Date(p.year, p.month, 1) > new Date()
}

// Short month names for display
const MONTH_NAMES = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']

const formatPoint = (ym) => {
  const p = parseYM(ym)
  if (!p) return ''
  return `${MONTH_NAMES[p.month - 1]} ${p.year}`
}

const getYears = (t) => {
  if (!t?.start) return ''
  const { year: startYear } = parseYM(t.start)
  const future = !t.end || (COMPRESS_FUTURE_DATES && isFuture(t.end))
  const end = future ? 'Currently' : parseYM(t.end).year

  return startYear === end ? `${startYear}` : `${startYear} - ${end}`
}

export const formatTimeline = (t) => {
  if (!t?.start) return ''
  const start = formatPoint(t.start)
  const future = !t.end || (COMPRESS_FUTURE_DATES && isFuture(t.end))

  if (future) return `${start} - Currently`

  const end = formatPoint(t.end)
  return start === end ? start : `${start} - ${end}`
}

export const describeProject = (item) =>
  [item.type, item.role].filter(Boolean).join('\u00A0· ')

export const projects = sourceProjects
  .filter((p) => !p.disabled)
  .map((p, i) => {
    const slug = slugify(p.slug || p.title, `project-${i + 1}`)

    const companies = (Array.isArray(p.companies) ? p.companies : [])
      .map(c => ({ ...c, logo: toPublicUrl(c.logo) }))

    const mainCompany = companies[0] || {
      name: p.companyName,
      url: p.companyUrl,
      logo: toPublicUrl(p.companyLogo)
    }

    const upcoming = isUpcoming(p.upcoming)

    return {
      ...p,
      title: upcoming ? 'Upcoming Project' : p.title,
      image: upcoming ? '/projects/project_upcoming.jpg' : toPublicUrl(p.poster),
      type: p.type,
      role: p.role,
      companyUrl: mainCompany.url,
      companyName: mainCompany.name,
      companyDisplayName: mainCompany.displayName || mainCompany.name,
      companies,
      slug,
      imdb: upcoming ? null : p.imdbLink,
      trailer: upcoming ? null : p.trailerLink,
      years: getYears(p.timeline),
    }
  })

export const projectsBySlug = Object.fromEntries(
  projects.map(p => [p.slug, p])
)

export const getProjectBySlug = (slug) => projectsBySlug[slug]
