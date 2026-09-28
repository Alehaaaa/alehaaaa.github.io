import { useCallback, useEffect, useRef } from 'react'
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'
import { describeProject } from './utils'

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const link = (href, label) =>
  `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`

// Poster slide for a project: title, "type · role" line and Trailer / IMDb links.
export const projectSlide = (project, description = describeProject(project)) => {
  const links = [
    project.trailer && link(project.trailer, 'Trailer'),
    project.imdb && link(project.imdb, 'IMDb'),
  ].filter(Boolean).join(' · ')

  return {
    href: project.image,
    type: 'image',
    alt: project.title ? `Poster for ${project.title}` : 'Project poster',
    title: escapeHtml(project.title || ''),
    description: [description && escapeHtml(description), links].filter(Boolean).join('<br>'),
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

  useEffect(() => () => {
    instance.current?.destroy()
    instance.current = null
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
