import React from 'react'
import Reveal from './Reveal'
import projectsData from '../projects.json'
import { toPublicUrl } from '../lib/utils'
import LightboxImage from './LightboxImage'

const items = projectsData.projects.map((p) => ({
  title: p.title,
  image: toPublicUrl(p.poster),
  type: p.type,
  role: p.role,
  companyUrl: p.companyLink,
  companyName: p.companyName || '',
  years: Array.isArray(p.year) ? p.year : [],
}))

export default function Explore() {
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)

  return (
    <section className="py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-16 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-black">Explore</h2>
        </Reveal>

        <div className="border-t border-b border-black">
          <div className="divide-y divide-black">
            {items.map((item, idx) => {
              const years = item.years
              let yearStr = ''
              if (years.length === 1) yearStr = String(years[0])
              else if (years.length >= 2) yearStr = years[0] === years[years.length - 1] ? String(years[0]) : `${years[0]} - ${years[years.length - 1]}`
              const description = [item.type, item.role].filter(Boolean).join(' • ')

              return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start py-12">
                  <div className="text-left">
                    <h3 className="text-3xl md:text-4xl text-black font-medium">{item.title}</h3>
                  </div>
                  <div className="text-left">
                    <p className="text-xl text-black leading-relaxed">{description}</p>
                    <p className="text-xl text-black/80 mt-2">
                      {yearStr}
                      {item.companyUrl && (
                        <>
                          <span className="mx-2 text-gray-400">|</span>
                          <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="no-underline font-light text-black/80 hover:opacity-80">{item.companyName || 'Company'}</a>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <div className="aspect-[3/2] overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => { setImageSrc(item.image); setImageOpen(true) }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <LightboxImage open={imageOpen} onClose={() => setImageOpen(false)} src={imageSrc} alt="" />
    </section>
  )
}

