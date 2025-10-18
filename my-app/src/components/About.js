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
            I'm Alejandro, a character-focused 3D animator from Barcelona, now based in Berlin. I love finding the little choices that make a performance feel honest: clear storytelling, appealing timing, strong posing, and clean polish.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Recently I animated on "Three Bags Full" at Framestore. Before that, I spent two years at Lumatic VFX & Animation on Die Schule der magischen Tiere (movies 3 & 4), and even built a few pipeline tools to help the team move faster.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-xl text-gray-600 leading-relaxed">
            I care about hitting deadlines, keeping quality high, supporting my teammates, and bringing a bit of joy to every shot.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
