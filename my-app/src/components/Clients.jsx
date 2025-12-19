import Reveal from './Reveal'

export default function Clients() {
  const clients = [
    "Metropolitan Museum",
    "Urban Development Corp",
    "Green Building Initiative",
    "Cultural Arts Foundation",
    "Sustainable Living Co",
    "Modern Architecture Institute"
  ]
  return (
    <section className="py-40 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="text-left mb-16">
          <h2 className="text-6xl md:text-7xl font-light text-foreground mb-4">Clients</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <Reveal key={index} delay={75 * (index % 6)}>
              <div className="text-center">
                <p className="text-base md:text-lg text-muted-foreground font-medium">{client}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
