import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { projects } from "@/lib/utils";
import LightboxVideo, { toEmbedSrc } from "./LightboxVideo";
import LightboxImage from "./LightboxImage";

export default function Projects() {
  const scrollContainerRef = useRef(null);

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.8; // scroll 80% of width

    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section id="projects" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto mb-12">
        <Reveal>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 tracking-tight">
            Projects
          </h2>
        </Reveal>
      </div>

      <div className="relative group/container">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 hidden md:block opacity-0 group-hover/container:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-3 bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 hidden md:block opacity-0 group-hover/container:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('right')}
            className="p-3 bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scrollbar-none px-6 md:px-16 scroll-pl-6 md:scroll-pl-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-none snap-start w-[85vw] md:w-[45vw] lg:w-[30vw]"
            >
              <div className="flex flex-col h-full group">
                <div
                  className="relative aspect-[4/3] overflow-hidden mb-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  onClick={() => {
                    setImageSrc(p.image);
                    setImageAlt(p.title);
                    setImageDescription([p.type, p.role].filter(Boolean).join(" · "));
                    setImageOpen(true);
                  }}
                >
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-black uppercase mb-2 tracking-tighter">
                  {p.title}
                </h3>

                <div className="text-black font-bold text-lg mb-4 border-l-4 border-black pl-3 flex flex-col gap-1">
                  <span>{[p.type, p.role].filter(Boolean).join(" · ")}</span>
                  <div className="flex items-center text-base font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                      {p.companyUrl && (
                        <>
                          <a
                            href={p.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:bg-black hover:text-white px-1 -ml-1 transition-colors"
                          >
                            {p.companyDisplayName || p.companyName || 'Company'}
                          </a>
                          <span>·</span>
                        </>
                      )}
                      <span>
                        {p.years && p.years.length > 0 ? (
                          p.years.length === 1 ? p.years[0] : `${Math.min(...p.years)} - ${Math.max(...p.years)}`
                        ) : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-4">
                  {p.trailer && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const isMobile = window.innerWidth < 768; // md breakpoint
                        const embed = toEmbedSrc(p.trailer);

                        if (isMobile || !embed) {
                          window.open(p.trailer, "_blank", "noopener,noreferrer");
                        } else {
                          setVideoSrc(embed);
                          setVideoTitle(p.title);
                          setVideoDescription([p.type, p.role].filter(Boolean).join(" · "));
                          setVideoOpen(true);
                        }
                      }}
                      className="px-6 py-2 border-2 border-black bg-white text-lg font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                    >
                      Trailer
                    </button>
                  )}
                  {p.imdb && (
                    <a
                      href={p.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border-2 border-black bg-white text-lg font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
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

      <LightboxVideo
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={videoSrc}
        title={`Trailer for ${videoTitle}`}
        description={videoDescription}
      />
      <LightboxImage
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        src={imageSrc}
        alt={`Poster for ${imageAlt}`}
        description={imageDescription}
      />
    </section>
  );
}
