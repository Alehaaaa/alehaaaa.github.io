import React, { useMemo, useState } from 'react'
import Reveal from './Reveal'
import { projects, describeProject, formatTimeline } from '../lib/utils'
import LightboxImage from './LightboxImage'
import LightboxVideo, { toEmbedSrc } from './LightboxVideo'
import { CompanyLogo } from './CompanyLogo'

export default function Explore() {
  const [lightbox, setLightbox] = useState({ open: false, src: null, alt: '', description: '' })
  const [video, setVideo] = useState({ open: false, src: null, title: '', description: '' })
  const [companiesOpen, setCompaniesOpen] = useState(false)

  /* Extract unique tags from projects (excluding companies) */
  const allTags = useMemo(() => {
    const tags = new Set()

    projects.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag.toLowerCase()))
      } else if (p.tags) {
        tags.add(p.tags.toLowerCase())
      }
    })

    return Array.from(tags).sort((a, b) => {
      if (a === "studies") return 1
      if (b === "studies") return -1
      return a.localeCompare(b)
    })
  }, [])


  /* Extract unique companies */
  const allCompanies = useMemo(() => {
    const companies = new Set()
    projects.forEach(p => {
      if (Array.isArray(p.companies)) {
        p.companies.forEach(c => {
          if (c.name) companies.add(c.name)
        })
      }
    })
    return Array.from(companies)
  }, [])


  const [selectedTags, setSelectedTags] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState(allCompanies)


  const toggleTag = (tag) => {
    const t = tag.toLowerCase()
    setSelectedTags(prev =>
      prev.includes(t)
        ? prev.filter(x => x !== t)
        : [...prev, t]
    )
  }


  const toggleCompany = (company) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    )
  }


  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0 && selectedCompanies.length === 0) return projects

    return projects.filter(p => {
      // TAGS — now fully case-insensitive
      let tagsMatch = true
      if (selectedTags.length > 0) {
        const projectTags = new Set()
        if (Array.isArray(p.tags)) p.tags.forEach(t => projectTags.add(t.toLowerCase()))
        else if (p.tags) projectTags.add(p.tags.toLowerCase())

        tagsMatch = selectedTags.some(tag => projectTags.has(tag))
      }

      // COMPANIES — keep original casing (names)
      let companiesMatch = true
      if (selectedCompanies.length > 0) {
        const projectCompanies = new Set()
        if (Array.isArray(p.companies)) p.companies.forEach(c => projectCompanies.add(c.name))

        companiesMatch = selectedCompanies.some(company => projectCompanies.has(company))
      }

      return tagsMatch && companiesMatch
    })
  }, [selectedTags, selectedCompanies, allCompanies])


  const openLightbox = (item) => setLightbox({
    open: true,
    src: item.image,
    alt: item.title || '',
    description: describeProject(item)
  })

  const openVideo = (item, embedSrc) => setVideo({
    open: true,
    src: embedSrc,
    title: item.title || '',
    description: describeProject(item)
  })

  // Helper to determine if a company is checked
  const isCompanyChecked = (company) => selectedCompanies.includes(company)

  return (
    <section id="explore" className="py-40 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-12 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-foreground mb-8">Explore</h2>

          {/* Tag Cloud & Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            {allTags.map(tag => {
              const isActive = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-4 py-2 border-2 border-[color:var(--neo-border)] text-lg font-bold uppercase transition-all
                    ${isActive
                      ? 'bg-foreground text-background shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-background text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px]'}
                  `}
                >
                  {tag}
                </button>
              )
            })}

            {/* Separator - thinner than main divider */}
            <div className="w-[2px] h-10 bg-foreground mx-2 hidden sm:block"></div>

            {/* Companies Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCompaniesOpen(!companiesOpen)}
                className={`
                  flex items-center gap-2 px-4 py-2 border-2 border-[color:var(--neo-border)] text-lg font-bold uppercase transition-all
                  ${companiesOpen || selectedCompanies.length > 0
                    ? 'bg-background text-foreground shadow-[2px_2px_0px_0px_var(--neo-shadow)] translate-x-[2px] translate-y-[2px]'
                    : 'bg-background text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px]'}
                `}
              >
                Companies {(selectedCompanies.length === 0 || selectedCompanies.length === allCompanies.length) ? '(ALL)' : `(${selectedCompanies.length})`}
                <svg
                  className={`w-4 h-4 transition-transform ${companiesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {companiesOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCompaniesOpen(false)}
                  ></div>
                  <div className="absolute top-full left-0 mt-2 w-80 bg-background border-2 border-[color:var(--neo-border)] shadow-[4px_4px_0px_0px_var(--neo-shadow)] z-20 max-h-80 overflow-y-auto">
                    {allCompanies.map(company => (
                      <label
                        key={company}
                        className="flex items-center px-4 py-2 hover:bg-muted cursor-pointer text-lg font-bold uppercase"
                      >
                        <input
                          type="checkbox"
                          checked={isCompanyChecked(company)}
                          onChange={() => toggleCompany(company)}
                          className="mr-3 w-5 h-5 border-2 border-[color:var(--neo-border)] rounded-none appearance-none checked:bg-foreground checked:after:content-['✓'] checked:after:text-background checked:after:block checked:after:text-center checked:after:text-sm checked:after:leading-4"
                        />
                        {company}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {(selectedTags.length > 0 || (selectedCompanies.length !== allCompanies.length && selectedCompanies.length > 0)) && (
              <button
                onClick={() => {
                  setSelectedTags([])
                  setSelectedCompanies(allCompanies)
                }}
                className="px-4 py-2 text-lg font-bold underline decoration-2 underline-offset-4 hover:text-gray-600 ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </Reveal>

        <div className="border-t-4 border-b-4 border-[color:var(--neo-border)] mt-12">
          <div className="divide-y-2 divide-[color:var(--neo-border)]">
            {filteredProjects.length === 0 ? (
              <div className="py-12 text-center text-xl font-bold">No projects found with selected filters.</div>
            ) : (
              filteredProjects.map((item, idx) => {
                const timelineStr = formatTimeline(item.timeline)
                const description = describeProject(item)

                return (
                  <div
                    key={item.slug || idx}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1.25fr_1fr] gap-7 items-start md:py-12 pt-10 pb-16"
                  >
                    <div className="text-left">
                      <h3 className="text-4xl text-foreground font-black uppercase text-balance tracking-tighter mb-3">{item.title}</h3>
                      <div className="flex flex-row md:flex-col items-start gap-4">
                        {item.companies?.filter(c => c.logo).map((company, cIdx) => (
                          <CompanyLogo
                            key={cIdx}
                            src={company.logo}
                            name={company.name}
                            scale={company.scale || 1}
                            url={company.url}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-left flex flex-col h-full">
                      <p className="text-2xl text-foreground font-bold leading-tight text-balance mb-1 border-l-2 border-[color:var(--neo-border)] pl-4 pt-2">
                        {description}
                      </p>
                      <div className="flex flex-wrap items-center text-xl font-medium text-foreground mt-0 pl-4 pb-2">
                        <p>{timelineStr}</p>
                      </div>
                      {(item.trailer || item.imdb) && (
                        <div className="flex items-center gap-3 mt-auto justify-end">
                          {item.trailer && (
                            <a
                              href={item.trailer}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                const embed = toEmbedSrc(item.trailer);
                                if (window.innerWidth >= 768 && embed) {
                                  e.preventDefault();
                                  openVideo(item, embed);
                                }
                              }}
                              className="px-4 py-1.5 border-2 border-[color:var(--neo-border)] bg-background text-base font-bold text-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer"
                            >
                              Trailer
                            </a>
                          )}
                          {item.imdb && (
                            <a
                              href={item.imdb}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-1.5 border-2 border-[color:var(--neo-border)] bg-background text-base font-bold text-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                            >
                              IMDb
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="aspect-[3/2] overflow-hidden bg-background border-2 border-[color:var(--neo-border)] shadow-[6px_6px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)] transition-all cursor-pointer">
                        <img
                          src={item.image}
                          alt={item.title || 'Project artwork'}
                          className="w-full h-full object-cover"
                          onClick={() => openLightbox(item)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
      <LightboxImage
        open={lightbox.open}
        onClose={() => setLightbox(prev => ({ ...prev, open: false }))}
        src={lightbox.src}
        alt={`Poster for ${lightbox.alt}`}
        description={lightbox.description}
      />
      <LightboxVideo
        open={video.open}
        onClose={() => setVideo(prev => ({ ...prev, open: false }))}
        src={video.src}
        title={`Trailer for ${video.title}`}
        description={video.description}
      />
    </section>
  )
}
