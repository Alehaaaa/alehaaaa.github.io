import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Explore from './components/Explore'
// import Clients from './components/Clients'
// import Contact from './components/Contact'
import About from './components/About'
import Footer from './components/Footer'
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <Hero />
        <Projects />
        <About />
        <Explore />
        {/* <Clients />
        <Contact /> */}
      </main>
      <Footer />
    </div>
  )
}
export default App