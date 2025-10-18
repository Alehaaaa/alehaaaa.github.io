import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-left">
        <Reveal>
          <h2 className="text-6xl lg:text-7xl font-light text-black mb-10">About</h2>
        </Reveal>
        <div className="lg:flex lg:items-start lg:gap-24">
          <div className="lg:flex-1">
            <Reveal delay={100}>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                I'm Alejandro, a character 3D animator from Barcelona. I love challenges, developing a shot and emboding characters to make a performance feel real and alive.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                I am currently animating for Framestore London on the upcoming feature film "Three Bags Full". Before that, I spent two years at the studio Lumatic VFX animating on Die Schule der magischen Tiere 3 and 4, where I even built pipeline tools that speed up the workflow of the animation team.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-gray-600 leading-relaxed">
                I hit deadlines, keep quality high, support my colleagues, and always bring joy to every shot.
              </p>
            </Reveal>
          </div>
          <Reveal delay={250}>
            <div className="mt-12 lg:mt-0 lg:ml-auto w-full max-w-full lg:max-w-sm flex gap-4 lg:gap-5 lg:items-end flex-col md:flex-row lg:flex-col">
              <a
                href="/cv/CV_EN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none inline-flex justify-center w-full px-8 py-4 border border-black text-xl lg:text-2xl font-base text-black hover:bg-black hover:text-white transition-colors"
              >
                CV
              </a>
              <a
                href="https://www.linkedin.com/in/alejandro-martin-407527215"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none inline-flex justify-center w-full px-8 py-4 border border-black text-xl lg:text-2xl font-base text-black hover:bg-black hover:text-white transition-colors"
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
