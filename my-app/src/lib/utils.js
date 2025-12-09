import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { projects as sourceProjects } from '../data/projects'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
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

/** Normalize paths: 'public/img.jpg' -> '/img.jpg' */
export function toPublicUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  return p.replace(/^public\//, '/').replace(/^\/?/, '/')
}

export const projects = sourceProjects
  .filter((item) => !item.disabled)
  .map((item, index) => {
    const slug = slugify(item.slug || item.title, `project-${index + 1}`)
    const companies = (Array.isArray(item.companies) ? item.companies : [])
      .map(c => ({ ...c, logo: toPublicUrl(c.logo) }))
    const primaryCompany = companies[0] || {
      name: item.companyName,
      url: item.companyUrl,
      logo: toPublicUrl(item.companyLogo)
    }

    return {
      ...item,
      title: item.title,
      image: toPublicUrl(item.poster),
      type: item.type,
      role: item.role,
      companyUrl: primaryCompany.url,
      companyName: primaryCompany.name,
      companyDisplayName: primaryCompany.displayName || primaryCompany.name,
      companies,
      slug,
      imdb: item.imdbLink,
      trailer: item.trailerLink,
      years: item.year || [],
    }
  })

export const projectsBySlug = projects.reduce((acc, p) => {
  acc[p.slug] = p
  return acc
}, {})

export const getProjectBySlug = (slug) => projectsBySlug[slug]
