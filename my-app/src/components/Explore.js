import Reveal from './Reveal'

const items = [
  {
    title: 'The Cultural Center',
    description: 'A modern cultural hub designed for community engagement',
    image: 'https://picsum.photos/id/1080/800/600',
  },
  {
    title: 'Green Spacing',
    description: 'Sustainable architecture integrated with natural landscapes',
    image: 'https://picsum.photos/id/1082/800/600',
  },
  {
    title: 'Float House',
    description: 'Innovative residential design with floating elements',
    image: 'https://picsum.photos/id/1081/800/600',
  },
]

export default function Explore() {
  return (
    <section className="py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="mb-16 text-left">
          <h2 className="text-6xl md:text-7xl font-light text-black">Explore</h2>
        </Reveal>

        <div className="border-t border-b border-black">
          <div className="divide-y divide-black">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start py-14">
                <div className="text-left">
                  <h3 className="text-3xl md:text-4xl text-black font-medium">{item.title}</h3>
                </div>
                <div className="text-left">
                  <p className="text-xl text-black leading-relaxed">{item.description}</p>
                </div>
                <div className="my-2">
                  <div className="aspect-[3/2] overflow-hidden bg-gray-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
