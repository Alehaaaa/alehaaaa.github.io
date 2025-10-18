export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-medium mb-4">Alejandro</h3>
            <p className="text-gray-400 text-balance">
              Character animation with clear storytelling, strong acting, and clean polish.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-lg">Contact</h4>
            <div className="flex flex-col space-y-2 text-base text-gray-400">
              <a
                href="mailto:alehamartinva@gmail.com"
                className="hover:text-white transition-colors"
              >
                alehamartinva@gmail.com
              </a>
              <a
                href="tel:+34671213938"
                className="hover:text-white transition-colors"
              >
                +34 671 21 39 38
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-lg">Socials</h4>
            <div className="flex flex-col space-y-2 text-base text-gray-400">
              <a className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/alejandro-martin-407527215">LinkedIn</a>
              <a className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/alejandro_anim/">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Alejandro Martín. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
