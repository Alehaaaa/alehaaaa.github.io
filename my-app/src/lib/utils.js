import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { projects as sourceProjects } from '../data/projects'

export const cn = (...inputs) => twMerge(clsx(inputs))

const monthMap = {
  "Jan.": 0, "Feb.": 1, "Mar.": 2, "Apr.": 3, "May": 4, "Jun.": 5,
  "Jul.": 6, "Aug.": 7, "Sep.": 8, "Oct.": 9, "Nov.": 10, "Dec.": 11
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

export const toPublicUrl = (p) => {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  return p.replace(/^public\//, '/').replace(/^\/?/, '/')
}

const isFuture = (monthStr, year) => {
  const month = monthMap[monthStr] ?? 11
  return new Date(year, month + 1, 1) > new Date()
}

const formatPoint = (p) => [p?.month, p?.year].filter(Boolean).join(' ')

const getYears = (t) => {
  if (!t?.start) return ''
  const start = t.start.year
  const future = !t.end || isFuture(t.end.month, t.end.year)
  const end = future ? "Currently" : t.end.year

  return start === end ? `${start}` : `${start} - ${end}`
}

export const formatTimeline = (t) => {
  if (!t?.start) return ''
  const start = formatPoint(t.start)
  const future = !t.end || isFuture(t.end.month, t.end.year)

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

    return {
      ...p,
      title: p.title,
      image: toPublicUrl(p.poster),
      type: p.type,
      role: p.role,
      companyUrl: mainCompany.url,
      companyName: mainCompany.name,
      companyDisplayName: mainCompany.displayName || mainCompany.name,
      companies,
      slug,
      imdb: p.imdbLink,
      trailer: p.trailerLink,
      years: getYears(p.timeline),
    }
  })

export const projectsBySlug = Object.fromEntries(
  projects.map(p => [p.slug, p])
)

export const getProjectBySlug = (slug) => projectsBySlug[slug]
