import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getProjectBySlug, toPublicUrl, formatTimeline } from '../lib/utils'
import LightboxImage from '../components/LightboxImage'
import { CompanyLogo } from '../components/CompanyLogo'

const buildLinks = (project) => {
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

  const detailLinks = Array.isArray(project.detail?.links) ? project.detail.links : []
  detailLinks.forEach((entry) => append(entry))

  if (project.trailer) append({ label: 'Trailer', href: project.trailer })
  if (project.imdb) append({ label: 'IMDb', href: project.imdb })

  return items
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  const navigate = useNavigate()
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

  const handleBack = (e) => {
    // If the browser has history (meaning they came from home page), just do back() to restore scroll position!
    if (window.history.state && window.history.state.idx > 0) {
      e.preventDefault();
      navigate(-1);
    }
  }

  const descriptionParts = [project.type, project.role].filter(Boolean)
  const detailsLine = descriptionParts.join(' / ')
  
  const timelineLabel = formatTimeline(project.timeline)
  const companies = Array.isArray(project.companies) ? project.companies : []
  const links = buildLinks(project)

  // Reflections / Experience properties
  const experienceTitle = (project.detail?.experienceTitle || 'Reflections & Experience').trim()
  const subtitle = (project.detail?.subtitle || '').trim()
  const content =
    Array.isArray(project.detail?.content) && project.detail.content.length > 0
      ? project.detail.content
      : ['Project reflections and write-up coming soon.']

  return (
    <section className="py-24 md:py-32 bg-background min-h-screen">
      <div className="max-w-[120em] w-[85vw] mx-auto px-4">
        {/* Back navigation arrow */}
        <Link
          to="/"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-foreground text-lg underline mb-10 group"
          aria-label="Back to explore section"
        >
          <svg
            aria-hidden="true"
            className="h-3 w-8 text-foreground group-hover:-translate-x-1.5 transition-transform"
            viewBox="0 0 44 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M42.8633 9.18125L3.37868 9.18125"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span className="font-bold uppercase tracking-wider text-base">Back to Explore</span>
        </Link>

        {/* Two Column Layout: Details on left, Poster on top right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start mb-20">
          
          {/* Left Column: Title, Type, Date, Company Label + Logo */}
          <div className="text-left space-y-8">
            <div>
              <p className="text-xl md:text-2xl text-muted-foreground uppercase font-black tracking-widest mb-3">
                {project.type}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-foreground leading-none tracking-tighter">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-foreground mt-6 uppercase border-l-4 border-[color:var(--neo-border)] pl-4">
                {project.role} · {timelineLabel || project.years}
              </p>
            </div>

            {/* Company & External Links Section in a Single Horizontal Row */}
            {(companies.length > 0 || links.length > 0) && (
              <div className="border-t-2 border-[color:var(--neo-border)] pt-8 flex flex-wrap items-end justify-between gap-8">
                {/* Company Logos */}
                {companies.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                      Company:
                    </h2>
                    <div className="flex flex-wrap items-center gap-6">
                      {companies.map((company, idx) => (
                        <CompanyLogo
                          key={idx}
                          src={toPublicUrl(company.logo)}
                          name={company.displayName || company.name || 'Company'}
                          scale={company.scale || 1}
                          url={company.url}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* External Action Links (Trailer & IMDb) */}
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-4 text-base font-bold uppercase pb-1">
                    {links.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-[color:var(--neo-border)] bg-background text-base font-bold text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Poster at native proportions */}
          <div
            className="overflow-hidden bg-background border-2 border-[color:var(--neo-border)] shadow-[8px_8px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:translate-x-[5px] hover:translate-y-[5px] transition-all cursor-pointer select-none"
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
              className="w-full h-auto block pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Bottom Reflections & Experience (Blog Section) */}
        <div className="border-t-4 border-[color:var(--neo-border)] pt-16 text-left space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-foreground leading-tight tracking-tight">
              {experienceTitle}
            </h2>
            {subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed italic">
                {subtitle}
              </p>
            )}
          </div>

          <div className="space-y-6 max-w-4xl text-lg md:text-xl text-foreground leading-relaxed font-light">
            {content.map((paragraph, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </div>
      </div>

      <LightboxImage
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={project.image}
        alt={project.title ? `Poster for ${project.title}` : 'Project image'}
        description={detailsLine}
        trailer={project.trailer}
        imdb={project.imdb}
      />
    </section>
  )
}
