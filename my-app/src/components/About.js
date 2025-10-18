import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-left">
        <Reveal>
          <h2 className="text-6xl md:text-7xl font-light text-black mb-10">About</h2>
        </Reveal>
        <div className="md:flex md:items-start md:gap-16">
          <div className="md:flex-1">
            <Reveal delay={100}>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                I'm Alejandro, a character 3D animator from Barcelona. I love finding the little choices that make a performance feel honest: clear storytelling, appealing timing, strong posing, and clean polish.
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
          <Reveal delay={250}>
            <div className="mt-12 md:mt-0 md:ml-auto w-full max-w-2xl md:max-w-sm flex flex-wrap gap-4 md:flex-col md:gap-5 md:items-end text-left md:text-right">
              <a
                href="/cv/CV_EN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex justify-center px-8 py-4 border border-black text-lg md:text-xl font-medium text-black hover:bg-black hover:text-white transition-colors"
              >
                CV
              </a>
              <a
                href="https://www.linkedin.com/in/alejandro-martin-407527215"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex justify-center px-8 py-4 border border-black text-lg md:text-xl font-medium text-black hover:bg-black hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
