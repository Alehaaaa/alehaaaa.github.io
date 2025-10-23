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

const describeProject = (item) => {
  const parts = [item.type, item.role].filter(Boolean)
  return parts.join(' / ')
}

export default function Explore() {
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)
  const [imageAlt, setImageAlt] = React.useState('')

  return (
    <section id="explore" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-16 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-black">Explore</h2>
        </Reveal>

        <div className="border-t border-b border-black">
          <div className="divide-y divide-black">
            {projects.map((item, idx) => {
              const yearStr = formatYears(item.years)
              const description = describeProject(item)

              return (
                <div
                  key={item.slug || idx}
                  className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start md:py-12 pt-10 pb-16"
                >
                  <div className="text-left">
                    <h3 className="text-3xl text-black font-medium text-balance">{item.title}</h3>
                  </div>
                  <div className="text-left flex flex-col h-full">
                    <p className="text-xl text-black leading-relaxed text-balance mb-1">
                      {description}
                    </p>
                    <div className="flex flex-wrap items-center text-xl text-black gap-3 md:gap-4 xl:gap-5 2xl:gap-6 mt-1">
                      <p>{yearStr}</p>
                      {item.companyUrl && (
                        <>
                          <span className="mx-1">|</span>
                          <a
                            href={item.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline font-light hover:opacity-80"
                          >
                            {item.companyDisplayName || item.companyName || 'Company'}
                          </a>
                        </>
                      )}
                    </div>
                    <Link
                      to={`/projects/${item.slug}`}
                      className="inline-flex items-center justify-center border border-black px-14 py-1.5 text-xs uppercase tracking-[0.22em] text-black transition-colors duration-200 hover:bg-black hover:text-white mt-6 md:mt-auto self-end min-w-[13.5rem]"
                    >
                      More...
                    </Link>
                  </div>
                  <div>
                    <div className="aspect-[3/2] overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.title || 'Project artwork'}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setImageSrc(item.image)
                          setImageOpen(true)
                          setImageAlt(item.title || '')
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <LightboxImage
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        src={imageSrc}
        alt={`Poster for ${imageAlt}`}
      />
    </section>
  )
}
