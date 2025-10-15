import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-left">
        <Reveal>
          <h2 className="text-6xl md:text-7xl font-light text-black mb-10">About</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Founded on the principle that architecture should enhance human experience, Radian brings together innovative design thinking with sustainable building practices. Our team of architects, designers, and builders work collaboratively to create spaces that are both beautiful and functional.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-xl text-gray-600 leading-relaxed">
            We believe that great architecture emerges from deep listening, careful observation, and a commitment to craftsmanship that honors both the environment and the communities we serve.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
