export default function Hero() {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src="https://player.vimeo.com/video/875111175?autoplay=1&muted=1&controls=1&title=0&dnt=1&loop=1"
            title="Animation demoreel for website"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="mt-14 text-left">
          <h1 className="text-6xl md:text-8xl font-light text-black text-balance">
            {"I'm Alejandro and I love animation. From Barcelona, or "}
            <span className="underline">wherever</span>
            {" you are..."}
          </h1>
        </div>
      </div>
    </section>
  )
}


