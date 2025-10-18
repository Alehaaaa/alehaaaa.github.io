import React from 'react'
import Reveal from './Reveal'
import { projects } from '../lib/utils'
import LightboxImage from './LightboxImage'

export default function Explore() {
  const [imageOpen, setImageOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState(null)
  const [imageAlt, setImageAlt] = React.useState('')

  return (
    <section className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-16 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-black">Explore</h2>
        </Reveal>

        <div className="border-t border-b border-black">
          <div className="divide-y divide-black">
            {projects.map((item, idx) => {
              const years = item.years
              let yearStr = ''
              if (years.length === 1) yearStr = String(years[0])
              else if (years.length >= 2) yearStr = years[0] === years[years.length - 1] ? String(years[0]) : `${years[0]} - ${years[years.length - 1]}`
              const description = [item.type, item.role].filter(Boolean).join(' · ')

              return (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start py-12">
                  <div className="text-left">
                    <h3 className="text-3xl text-black font-medium text-balance">{item.title}</h3>
                  </div>
                  <div className="text-left">
                    <p className="text-xl text-black leading-relaxed text-balance">{description}</p>
                    <div className="flex items-center mt-2 text-xl text-black 2xl:gap-8 xl:gap-6 md:gap-2 gap-4">
                      <p>{yearStr}</p>
                      <span className='mx-1'>|</span>
                      <a href={item.companyUrl} target="_blank" rel="noopener noreferrer"
                        className="no-underline font-light hover:opacity-80">{item.companyDisplayName || item.companyName || 'Company'}</a>
                    </div>
                  </div>
                  <div>
                    <div className="aspect-[3/2] overflow-hidden bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.image}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => { setImageSrc(item.image); setImageOpen(true); setImageAlt(item.title || '') }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <LightboxImage open={imageOpen} onClose={() => setImageOpen(false)} src={imageSrc} alt={`Poster for ${imageAlt}`} />
    </section>
  )
}
