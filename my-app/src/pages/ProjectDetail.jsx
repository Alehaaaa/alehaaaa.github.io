import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectBySlug, toPublicUrl } from '../lib/utils'
import LightboxImage from '../components/LightboxImage'

const formatYears = (years) => {
  if (!Array.isArray(years) || years.length === 0) return ''
  if (years.length === 1) return `${years[0]}`
  const sorted = [...years].sort()
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  return first === last ? `${first}` : `${first} - ${last}`
}

const formatTimelinePoint = (point) => {
  if (!point) return ''
  const month = point.month || ''
  const year = point.year
  if (month && Number.isFinite(year)) return `${month} ${year}`
  if (Number.isFinite(year)) return `${year}`
  return month
}

const formatTimeline = (timeline) => {
  if (!timeline) return ''
  const start = formatTimelinePoint(timeline.start)
  const end = formatTimelinePoint(timeline.end)
  if (start && end && start !== end) return `${start} – ${end}`
  return start || end || ''
}

const buildSocials = (project) => {
  const items = []
  const append = (entry) => {
    if (!entry) return
    const href = (entry.href || '').trim()
    const label = (entry.label || '').trim()
    const logo = entry.logo ? toPublicUrl(entry.logo) : ''
    if (!href || (!label && !logo)) return
    if (items.some((item) => item.href === href)) return
    const ariaLabel = entry.ariaLabel || label || 'External link'
    items.push({ href, label, logo, ariaLabel })
  }

  const detailSocials = Array.isArray(project.detail?.socials) ? project.detail.socials : []
  detailSocials.forEach((entry) => append(entry))

  if (project.trailer) append({ label: 'Trailer', href: project.trailer })
  if (project.imdb) append({ label: 'IMDb', href: project.imdb })

  return items
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const [lightboxOpen, setLightboxOpen] = React.useState(false)

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <section className="py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-left">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6">Project not found</h1>
          <p className="text-xl text-foreground mb-10">
            We could not locate that project. It may have been renamed or removed.
          </p>
          <Link to="/" className="text-xl underline text-foreground">
            Back to the homepage
          </Link>
        </div>
      </section>
    )
  }

  const descriptionParts = [project.type, project.role].filter(Boolean)
  const detailsLine = descriptionParts.join(' / ')
  const subtitle = (project.detail?.subtitle || '').trim() || 'More details coming soon.'
  const content =
    Array.isArray(project.detail?.content) && project.detail.content.length > 0
      ? project.detail.content
      : ['Project write-up coming soon.']
  const years = formatYears(project.years)
  const timelineLabel = formatTimeline(project.timeline)
  const socials = buildSocials(project)
  const companies = Array.isArray(project.companies) ? project.companies : []

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-[120em] w-[80vw] mx-auto px-4">
        <Link
          to="/"
          state={{ focus: 'explore' }}
          className="inline-flex items-center gap-2 text-foreground text-lg underline mb-10"
          aria-label="Open project image in lightbox"
        >
          <svg
            aria-hidden="true"
            className="h-3 w-8 text-foreground"
            viewBox="0 0 44 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M42.8633 9.18125L3.37868 9.18125"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span>Back to Explore</span>
        </Link>

        <div
          className="aspect-[16/9] md:aspect-[3/2] overflow-hidden bg-muted cursor-pointer"
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
              e.preventDefault()
              setLightboxOpen(true)
            }
          }}
        >
          <img
            src={project.image}
            alt={project.title || 'Project poster'}
            className="w-full h-full object-cover"
          />
        </div>

        <header className="mt-16 md:mt-20 text-left">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
            <div>
              <h1 className="text-5xl md:text-7xl font-light text-foreground leading-tight">
                {project.title}
              </h1>
              {detailsLine && (
                <p className="mt-4 text-xl md:text-2xl text-foreground font-light tracking-wide uppercase">
                  {detailsLine}
                </p>
              )}
            </div>

            {(companies.length > 0 || socials.length > 0 || timelineLabel || years) && (
              <div className="space-y-8 md:pl-10 md:border-l border-[color:var(--neo-border)] border-b md:border-b-0 pb-8">
                {companies.length > 0 && (
                  <div
                    className={`flex items-center gap-0 ${companies.length === 1 ? 'justify-start' : 'justify-between'
                      }`}
                  >
                    {companies.map((company, idx) => {
                      const label = company.displayName || company.name || 'Company'
                      const key = `${company.url || label}-${idx}`
                      const hasLink = Boolean(company.url)
                      const logo = company.logo ? toPublicUrl(company.logo) : ''
                      const isMultiple = companies.length > 1
                      const logoClass = isMultiple
                        ? 'block h-16 w-full max-w-[13rem] bg-center bg-contain bg-no-repeat'
                        : 'block h-16 w-[13rem] bg-center bg-contain bg-no-repeat'
                      const linkClass = isMultiple
                        ? 'flex-1 min-w-0 flex items-center justify-center transition-opacity duration-200 hover:opacity-80'
                        : 'inline-flex items-center justify-start transition-opacity duration-200 hover:opacity-80'
                      const spanClass = isMultiple
                        ? 'flex-1 min-w-0 flex items-center justify-center transition-opacity duration-200'
                        : 'inline-flex items-center justify-start transition-opacity duration-200'
                      const contentEl = logo ? (
                        <>
                          <span className="sr-only">{label}</span>
                          <span
                            aria-hidden="true"
                            className={logoClass}
                            style={{ backgroundImage: `url(${logo})` }}
                          />
                        </>
                      ) : (
                        <span className="text-lg font-light underline decoration-foreground/60 decoration-[1.5px] underline-offset-4 text-foreground">
                          {label}
                        </span>
                      )
                      return hasLink ? (
                        <a
                          key={key}
                          href={company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                          aria-label={`${label} website`}
                        >
                          {contentEl}
                        </a>
                      ) : (
                        <span key={key} className={spanClass} aria-hidden="true">
                          {contentEl}
                        </span>
                      )
                    })}
                  </div>
                )}

                {socials.length > 0 && (
                  <div className="flex flex-wrap gap-4 text-xl text-foreground uppercase">
                    {socials.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-foreground/60 decoration-[1.5px] underline-offset-4 hover:opacity-80"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}

                {(timelineLabel || years) && (
                  <p className="text-xl text-foreground font-light tracking-wide uppercase">
                    {timelineLabel || years}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>
        {subtitle && (
          <p className="mt-8 text-2xl md:text-3xl font-light text-foreground leading-snug">
            {subtitle}
          </p>
        )}

        <div className="mt-10 md:mt-16 space-y-8 text-left">
          {content.map((paragraph, idx) => (
            <p key={idx} className="text-lg md:text-xl text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <LightboxImage
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={project.image}
        alt={project.title ? `Poster for ${project.title}` : 'Project image'}
      />
    </section>
  )
}
