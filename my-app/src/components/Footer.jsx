export default function Footer() {
  return (
    <footer className="bg-black text-white py-24 border-t-8 border-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="pb-8 border-b-2 border-white/20 md:border-none md:pb-0">
            <h3 className="text-4xl font-black uppercase mb-6 tracking-tighter">Alejandro</h3>
            <p className="text-white font-medium text-xl leading-relaxed max-w-sm">
              Character animation with clear storytelling, strong acting, and clean polish.
            </p>
          </div>
          <div className="pb-8 border-b-2 border-white/20 md:border-none md:pb-0">
            <h4 className="font-bold uppercase text-2xl mb-6 tracking-tight">Contact</h4>
            <div className="flex flex-col space-y-4 text-xl font-medium">
              <a
                href="mailto:alehamartinva@gmail.com"
                className="hover:text-gray-300 transition-colors hover:underline decoration-2 underline-offset-4"
              >
                alehamartinva@gmail.com
              </a>
              <a
                href="tel:+34671213938"
                className="hover:text-gray-300 transition-colors hover:underline decoration-2 underline-offset-4"
              >
                +34 671 21 39 38
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase text-2xl mb-6 tracking-tight">Socials</h4>
            <div className="flex flex-col space-y-4 text-xl font-medium">
              <a className="hover:text-gray-300 transition-colors hover:underline decoration-2 underline-offset-4" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/alejandro-martin-407527215">LinkedIn</a>
              <a className="hover:text-gray-300 transition-colors hover:underline decoration-2 underline-offset-4" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/alejandro_anim/">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-white mt-16 pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base font-bold uppercase tracking-widest text-white/50">
            © 2025 Alejandro Martín
          </p>
          <p className="text-base font-bold uppercase tracking-widest text-white/50">
            Designed with Force
          </p>
        </div>
      </div>
    </footer>
  )
}
