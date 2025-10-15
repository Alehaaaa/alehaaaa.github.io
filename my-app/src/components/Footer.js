export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-4">Radian</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Building future-facing spaces for highly creative, considerate humans.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-lg">Contact</h4>
            <div className="space-y-2 text-base text-gray-400">
              <p>hello@radian.com</p>
              <p>+1 (555) 123-4567</p>
              <p>123 Architecture Lane<br />Design District, NY 10001</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-lg">Follow</h4>
            <div className="space-y-2 text-base text-gray-400">
              <p>Instagram</p>
              <p>LinkedIn</p>
              <p>Twitter</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Radian Architecture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
