import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import Reveal from './Reveal'
export default function Contact() {
  return (
    <section id="contact" className="py-40 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <div>
              <h2 className="text-6xl md:text-7xl font-light text-black mb-10">Let's Build!</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Ready to create something extraordinary? We'd love to hear about your project and explore how we can bring your vision to life.
              </p>
              <div className="space-y-4 text-gray-600">
                <p>hello@radian.com</p>
                <p>+1 (555) 123-4567</p>
                <p>123 Architecture Lane<br />Design District, NY 10001</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input type="text" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input type="text" className="w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input type="email" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <Input type="text" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea rows={6} className="w-full" />
              </div>
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Send Message
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
