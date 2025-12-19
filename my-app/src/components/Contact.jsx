// import { Button } from './ui/button'
// import { Input } from './ui/input'
// import { Textarea } from './ui/textarea'
import Reveal from './Reveal'
export default function Contact() {
  return (
    <section id="contact" className="py-40 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <div>
              <h2 className="text-6xl md:text-7xl font-light text-foreground mb-10">Let's Animate!</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                I love new projects and meeting new teams. If you're looking to add energy to a sequence, polish a tricky shot, or just explore what we can build together, drop me a line and let's talk.
              </p>
              <div className="text-xl text-muted-foreground leading-relaxed mb-8">
                <p>alehamartinva@gmail.com</p>
                <p>+34 671 21 39 38</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl text-muted-foreground mb-2">
                    First Name
                  </label>
                  <input type="text" className="neo-input w-full" />
                </div>
                <div>
                  <label className="block text-xl text-muted-foreground mb-2">
                    Last Name
                  </label>
                  <input type="text" className="neo-input w-full" />
                </div>
              </div>
              <div>
                <label className="block text-xl text-muted-foreground mb-2">
                  Email
                </label>
                <input type="email" className="neo-input w-full" />
              </div>
              <div>
                <label className="block text-xl text-muted-foreground mb-2">
                  Project Type
                </label>
                <input type="text" className="neo-input w-full" />
              </div>
              <div>
                <label className="block text-xl text-muted-foreground mb-2">
                  Message
                </label>
                <textarea rows={6} className="neo-input w-full" />
              </div>
              <button type="submit" className="neo-button w-full">
                Send Message
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
