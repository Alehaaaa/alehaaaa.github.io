import React from 'react'

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const ref = React.useRef(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const classes = [
    'transition-all duration-700 ease-out will-change-transform',
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    className,
  ]

  return (
    <Tag ref={ref} className={classes.join(' ')} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

