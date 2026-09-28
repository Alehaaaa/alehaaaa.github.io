import { useCallback, useEffect, useRef } from 'react'
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'
import './lightbox.css'
import { describeProject } from './utils'

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const link = (href, label, external = true) =>
  `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(label)}</a>`

const joinDots = (parts) => parts.filter(Boolean).join(' · ')

/**
 * Poster slide for a project. The caption shows the title, one details line
 * (type · role · companies · location · years) and a row of Trailer / IMDb / project page links.
 */
export const projectSlide = (project, { description = describeProject(project), detailLink = true } = {}) => {
  const companies = (project.companies?.length
    ? project.companies
    : [{ name: project.companyDisplayName || project.companyName, url: project.companyUrl }]
  ).filter((c) => c?.name)

  const credits = joinDots([
    companies.map((c) => (c.url ? link(c.url, c.displayName || c.name) : escapeHtml(c.displayName || c.name))).join(', '),
    project.location?.name && escapeHtml(project.location.name),
    project.years && escapeHtml(project.years),
  ])

  const meta = joinDots([description && escapeHtml(description), credits])
  const links = [
    project.trailer && link(project.trailer, 'Trailer'),
    project.imdb && link(project.imdb, 'IMDb'),
    detailLink && project.detail && project.slug && link(`#/projects/${project.slug}`, 'Project page', false),
  ].filter(Boolean).join('')

  return {
    href: project.image,
    type: 'image',
    alt: project.title ? `Poster for ${project.title}` : 'Project poster',
    title: escapeHtml(project.title || ''),
    description: [
      meta && `<span class="glb-meta">${meta}</span>`,
      links && `<span class="glb-links">${links}</span>`,
    ].filter(Boolean).join(''),
  }
}

// YouTube / Vimeo / direct video URL; GLightbox resolves the provider itself.
export const videoSlide = (href, title = '', description = '') => ({
  href,
  type: 'video',
  title: escapeHtml(title),
  description: escapeHtml(description),
})

export const trailerSlide = (project) =>
  videoSlide(project.trailer, project.title ? `Trailer for ${project.title}` : 'Trailer', describeProject(project))

/**
 * Returns `open(slides, index = 0, { onSlideChange })` backed by a single GLightbox instance.
 * `onSlideChange(index)` fires whenever the visible slide changes (including on open).
 */
export function useLightbox() {
  const instance = useRef(null)
  const slideChange = useRef(null)

  useEffect(() => {
    // In-app links (e.g. "Project page") change the route; close the lightbox with it
    const close = () => instance.current?.close()
    window.addEventListener('hashchange', close)
    return () => {
      window.removeEventListener('hashchange', close)
      instance.current?.destroy()
      instance.current = null
    }
  }, [])

  return useCallback((slides, index = 0, { onSlideChange } = {}) => {
    const elements = Array.isArray(slides) ? slides : [slides]
    if (!elements.length) return

    if (!instance.current) {
      instance.current = GLightbox({ elements, touchNavigation: true, autoplayVideos: true })
      instance.current.on('slide_changed', ({ current }) => slideChange.current?.(current.index))
    } else {
      instance.current.setElements(elements)
    }
    slideChange.current = onSlideChange
    instance.current.settings.loop = elements.length > 1
    instance.current.openAt(index)
  }, [])
}

// Click handler for links that should open a video in the lightbox instead of navigating.
export const openVideoOnClick = (open, slide) => (e) => {
  if (!slide?.href) return
  e.preventDefault()
  open(slide)
}
