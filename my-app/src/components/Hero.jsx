import { HERO_REEL } from '../data/projects'

export default function Hero() {
  return (
    <section className="relative bg-white py-10 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Video Container with Neo-Brutalist Border/Shadow */}
        <div className="relative aspect-video w-full overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black">
          <iframe
            src={HERO_REEL}
            title="Animation demoreel for website"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="mt-16 text-left">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-black uppercase leading-[1.0]">
            I'm Alejandro<br />
            and I animate.
          </h1>
          <p className="mt-6 text-4xl md:text-6xl font-medium border-l-4 border-black pl-6">
            From <span className="underline decoration-4 underline-offset-4">Barcelona</span>, or wherever you are.
          </p>
        </div>
      </div>
    </section>
  )
}
