import React from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { projects } from '../lib/utils'
import LightboxImage from './LightboxImage'

const formatYears = (years) => {
  if (!Array.isArray(years) || years.length === 0) return ''
  if (years.length === 1) return String(years[0])
  const sorted = [...years].sort()
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  return `${first} - ${last}`
}

const formatTimeline = (timeline) => {
  if (!timeline || !timeline.start) return ''
  const start = `${timeline.start.month} ${timeline.start.year}`
  const end = timeline.end ? `${timeline.end.month} ${timeline.end.year}` : 'Present'
  return `${start} - ${end}`
}

const describeProject = (item) => {
  const parts = [item.type, item.role].filter(Boolean)
  return parts.join('\u00A0· ')
}

export default function Explore() {
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)
  const [imageAlt, setImageAlt] = React.useState('')
  const [imageDescription, setImageDescription] = React.useState('')

  /* Extract unique tags from types */
  const allTags = React.useMemo(() => {
    const tags = new Set()
    projects.forEach(p => {
      if (p.type) tags.add(p.type)
    })
    return Array.from(tags).sort()
  }, [])

  const [selectedTags, setSelectedTags] = React.useState([])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredProjects = React.useMemo(() => {
    if (selectedTags.length === 0) return projects
    return projects.filter(p => selectedTags.includes(p.type))
  }, [selectedTags])

  return (
    <section id="explore" className="py-40 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-12 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-black mb-8">Explore</h2>

          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-4">
            {allTags.map(tag => {
              const isActive = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-4 py-2 border-2 border-black text-lg font-bold uppercase transition-all
                    ${isActive
                      ? 'bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]'
                      : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'}
                  `}
                >
                  {tag}
                </button>
              )
            })}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-4 py-2 text-lg font-bold underline decoration-2 underline-offset-4 hover:text-gray-600 ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </Reveal>

        <div className="border-t-4 border-b-4 border-black">
          <div className="divide-y-2 divide-black">
            {filteredProjects.length === 0 ? (
              <div className="py-12 text-center text-xl font-bold">No projects found with selected tags.</div>
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
                      <h3 className="text-4xl text-black font-black uppercase text-balance tracking-tighter mb-3">{item.title}</h3>
                      <div className="flex flex-row md:flex-col items-start gap-4">
                        {item.companies && item.companies.map((company, cIdx) => (
                          company.logo && (
                            <a
                              key={cIdx}
                              href={company.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block p-1 border border-transparent hover:bg-black transition-colors duration-200"
                            >
                              <img
                                src={company.logo}
                                alt={company.name}
                                style={{ height: `${3.5 * (company.scale || 1)}rem` }}
                                className="w-auto object-contain object-left transition-all duration-200 group-hover:invert"
                              />
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                    <div className="text-left flex flex-col h-full">
                      <p className="text-2xl text-black font-bold leading-tight text-balance mb-1 border-l-2 border-black pl-4 pt-2">
                        {description}
                      </p>
                      <div className="flex flex-wrap items-center text-xl font-medium text-black mt-0 pl-4 pb-2">
                        <p>{timelineStr}</p>
                      </div>
                    </div>
                    <div>
                      <div className="aspect-[3/2] overflow-hidden bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                        <img
                          src={item.image}
                          alt={item.title || 'Project artwork'}
                          className="w-full h-full object-cover"
                          onClick={() => {
                            setImageSrc(item.image)
                            setImageOpen(true)
                            setImageAlt(item.title || '')
                            setImageDescription(describeProject(item))
                          }}
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
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        src={imageSrc}
        alt={`Poster for ${imageAlt}`}
        description={imageDescription}
      />
    </section>
  )
}
