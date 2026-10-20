import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Reveal from "./Reveal";
import { projects } from "@/lib/utils";
import { useLightbox, projectSlide, trailerSlide, openVideoOnClick } from "@/lib/lightbox";

const describeProject = (p) => [p.type, p.role].filter(Boolean).join(' · ');

export default function Projects() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    skipSnaps: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Every poster is a slide of one gallery; browsing it keeps the carousel in sync.
  const posterSlides = useMemo(() => projects.map((p) => projectSlide(p, { description: describeProject(p) })), []);
  const openLightbox = useLightbox();
  const openPoster = (index) => openLightbox(posterSlides, index, {
    onSlideChange: (current) => emblaApi?.scrollTo(current)
  });

  return (
    <section id="projects" className="relative z-20 pt-24 pb-4 md:py-32 bg-transparent overflow-hidden pointer-events-none">
      <div className="container px-4 md:px-6 mx-auto mb-12 pointer-events-auto">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-tight">
            Projects
          </h2>
        </Reveal>
      </div>

      <div className="relative group/container pointer-events-auto">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 hidden md:block opacity-0 group-hover/container:opacity-100 transition-opacity">
          <button
            onClick={scrollPrev}
            className="p-3 bg-background border-2 border-[color:var(--neo-border)] text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 hidden md:block opacity-0 group-hover/container:opacity-100 transition-opacity">
          <button
            onClick={scrollNext}
            className="p-3 bg-background border-2 border-[color:var(--neo-border)] text-foreground shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Embla Viewport */}
        <div
          className="overflow-hidden px-6 md:px-16 transition-all cursor-grab active:cursor-grabbing md:cursor-ew-resize"
          ref={emblaRef}
          style={{ paddingBlock: '1em' }}
        >
          {/* Embla Container */}
          <div className="flex gap-6 touch-pan-y">
            {projects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 200px 0px 0px" }}
                transition={{ duration: 0.5 }}
                className="flex-[0_0_85vw] md:flex-[0_0_45vw] lg:flex-[0_0_30vw] min-w-0"
              >
                <div className="flex flex-col h-full group">
                  <div
                    className="relative aspect-[4/3] overflow-hidden mb-6 bg-background border-2 border-[color:var(--neo-border)] shadow-[6px_6px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)] transition-all cursor-pointer select-none"
                    onClick={() => openPoster(i)}
                  >
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={p.title}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-foreground uppercase mb-2 tracking-tighter select-none">
                    {p.title}
                  </h3>

                  <div className="text-foreground font-bold text-lg mb-4 border-l-2 border-[color:var(--neo-border)] pl-3 flex flex-col gap-1 select-none">
                    <span>{describeProject(p)}</span>
                    <div className="flex items-center text-base font-bold text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {p.companyUrl && (
                          <>
                            <a
                              href={p.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:bg-black hover:text-white px-1 -ml-1 transition-colors"
                            // No need to prevent default drag here usually with Embla unless it conflicts
                            >
                              {p.companyDisplayName || p.companyName || 'Company'}
                            </a>
                            <span>·</span>
                          </>
                        )}
                        {p.location && (
                          <>
                            <span>{p.location.name}</span>
                            <span>·</span>
                          </>
                        )}
                        <span>
                          {p.years}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-4">
                    {p.trailer && (
                      <a
                        href={p.trailer}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={openVideoOnClick(openLightbox, trailerSlide(p))}
                        className="px-6 py-2 border-2 border-[color:var(--neo-border)] bg-background text-lg font-bold text-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer select-none"
                      >
                        Trailer
                      </a>
                    )}
                    {p.imdb && (
                      <a
                        href={p.imdb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-[color:var(--neo-border)] bg-background text-lg font-bold text-foreground shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all select-none"
                      >
                        IMDb
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
