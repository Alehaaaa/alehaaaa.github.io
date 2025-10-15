export default function Hero() {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
          <img
            src="https://picsum.photos/id/1080/1920/1080"
            alt="Modern architectural building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="mt-14 text-left">
          <h1 className="text-6xl md:text-8xl font-light text-black leading-tight">
            Radian builds future-facing spaces for creative, considerate humans.
          </h1>
        </div>
      </div>
    </section>
  )
}
