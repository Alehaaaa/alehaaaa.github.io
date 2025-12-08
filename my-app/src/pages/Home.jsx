import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import About from '../components/About'
import Explore from '../components/Explore'

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (location.state && location.state.focus === 'explore') {
      const section = document.getElementById('explore')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      navigate('.', { replace: true, state: null })
    }
  }, [location, navigate])

  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Explore />
    </>
  )
}
