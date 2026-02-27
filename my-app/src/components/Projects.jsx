import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Reveal from "./Reveal";
import { projects } from "@/lib/utils";
import LightboxVideo, { toEmbedSrc } from "./LightboxVideo";
import LightboxImage from "./LightboxImage";

export default function Projects() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    skipSnaps: true
  });

  const [video, setVideo] = useState({ open: false, src: null, title: '', description: '' });
  const [image, setImage] = useState({ open: false, src: null, alt: '', description: '' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const describeProject = (p) => [p.type, p.role].filter(Boolean).join(' · ');

  const openImage = (p) => {
    setImage({
      open: true,
      src: p.image,
      alt: p.title,
      description: describeProject(p)
    });
  };

  const openVideo = (p, embedSrc) => setVideo({
    open: true,
    src: embedSrc,
    title: p.title,
    description: describeProject(p)
  });

  return (
    <section id="projects" className="relative z-20 py-24 md:py-32 bg-transparent overflow-hidden pointer-events-none">
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
          className="overflow-hidden px-6 md:px-16 cursor-grab active:cursor-grabbing md:cursor-ew-resize"
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
                    onClick={() => openImage(p)}
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
                        onClick={(e) => {
                          const embed = toEmbedSrc(p.trailer);
                          // For trailer, we want to open lightbox on desktop, link on mobile? 
                          // The previous logic had a width check.
                          if (window.innerWidth >= 768 && embed) {
                            e.preventDefault();
                            openVideo(p, embed);
                          }
                        }}
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

      <LightboxVideo
        open={video.open}
        onClose={() => setVideo(prev => ({ ...prev, open: false }))}
        src={video.src}
        title={`Trailer for ${video.title}`}
        description={video.description}
      />
      <LightboxImage
        open={image.open}
        onClose={() => setImage(prev => ({ ...prev, open: false }))}
        src={image.src}
        alt={`Poster for ${image.alt}`}
        description={image.description}
      />
    </section>
  );
}
