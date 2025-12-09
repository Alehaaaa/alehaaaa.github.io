import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";
import { projects } from "@/lib/utils";
import LightboxVideo, { toEmbedSrc } from "./LightboxVideo";
import LightboxImage from "./LightboxImage";

export default function Projects() {
  const scrollContainerRef = useRef(null);

  const [video, setVideo] = useState({ open: false, src: null, title: '', description: '' });
  const [image, setImage] = useState({ open: false, src: null, alt: '', description: '' });

  // Drag state for desktop
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);

  const CLICK_THRESHOLD = 10;
  const dragDistance = useRef(0);

  // New: Detect Desktop Mouse Environment
  const [isDesktopMouse, setIsDesktopMouse] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // We consider "Desktop Mouse" if screen is wide enough AND has a fine pointer (mouse)
      const isLarge = window.innerWidth >= 768;
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      setIsDesktopMouse(isLarge && isFinePointer);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getItemWidth = () => {
    const container = scrollContainerRef.current;
    if (!container || !container.children[0]) return 0;
    // Assuming the first child is the "sizer" or all are same width
    // The previous code used container.children[0].offsetWidth + 24 (gap)
    // We should be careful to get the actual item width.
    // The children are mapped inside.
    const item = container.querySelector('.project-card-container');
    return item ? item.offsetWidth + 24 : container.clientWidth * 0.45; // Fallback
  };

  const handleMouseDown = (e) => {
    // Only allow custom drag if we match our "Desktop Mouse" criteria
    if (!isDesktopMouse) return;

    setIsDragging(true);
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    dragDistance.current = 0;

    // Stop any ongoing animation
    if (scrollContainerRef.current.animation) {
      scrollContainerRef.current.animation.stop();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current);
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;

    // Track velocity
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = e.pageX - lastX.current;
      velocity.current = dx / dt; // pixels per ms
      lastX.current = e.pageX;
      lastTime.current = now;
    }

    dragDistance.current = Math.abs(walk);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If it was just a click, don't snap/scroll
    if (dragDistance.current < CLICK_THRESHOLD) return;

    const container = scrollContainerRef.current;
    const itemWidth = getItemWidth();

    // Calculate target
    // Project where the scroll would end up with current velocity
    // Simple physics: friction slows it down.
    // We can use a simplified approach: predict end point and snap to nearest.

    // Current scroll position
    const currentScroll = container.scrollLeft;

    const inertiaFactor = 300; // ms worth of travel
    const projectedScroll = currentScroll - (velocity.current * inertiaFactor);

    // Snap to nearest item
    const targetIndex = Math.round(projectedScroll / itemWidth);

    // Clamp
    const maxIndex = projects.length - 1;
    const clampedIndex = Math.max(0, Math.min(targetIndex, maxIndex));

    const targetScroll = clampedIndex * itemWidth;

    const distance = Math.abs(targetScroll - currentScroll);
    if (distance === 0) return;

    // Animate
    const controls = animate(currentScroll, targetScroll, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
      onUpdate: (v) => {
        if (container) container.scrollLeft = v;
      },
      onComplete: () => {
        container.animation = null;
      }
    });
    container.animation = controls;
  };

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  const wasDrag = () => dragDistance.current > CLICK_THRESHOLD;

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const itemWidth = getItemWidth();
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const currentIndex = Math.round(currentScroll / itemWidth);

    const targetIndex = direction === 'left'
      ? Math.max(0, currentIndex - 1)
      : Math.min(projects.length - 1, currentIndex + 1);

    const targetScroll = targetIndex * itemWidth;

    // Cancel any existing animation
    if (scrollContainerRef.current.animation) {
      scrollContainerRef.current.animation.stop();
    }

    const controls = animate(currentScroll, targetScroll, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      onUpdate: (v) => {
        if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = v;
      }
    });
    scrollContainerRef.current.animation = controls;
  };

  const describeProject = (p) => [p.type, p.role].filter(Boolean).join(' · ');

  const openImage = (p) => {
    if (wasDrag()) return; // Prevent opening when drag exceeded threshold
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
          className={`flex overflow-x-auto gap-6 pb-12 scrollbar-none px-6 md:px-16 md:cursor-e-resize select-none snap-x snap-mandatory ${isDesktopMouse ? 'snap-none' : ''}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 200px 0px 0px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] project-card-container snap-center snap-always"
            >
              <div className="flex flex-col h-full group">
                <div
                  className="relative aspect-[4/3] overflow-hidden mb-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  onClick={() => openImage(p)}
                >
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.title}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable="false"
                  />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-black uppercase mb-2 tracking-tighter">
                  {p.title}
                </h3>

                <div className="text-black font-bold text-lg mb-4 border-l-4 border-black pl-3 flex flex-col gap-1">
                  <span>{describeProject(p)}</span>
                  <div className="flex items-center text-base font-bold text-gray-500">
                    <div className="flex items-center gap-2">
                      {p.companyUrl && (
                        <>
                          <a
                            href={p.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:bg-black hover:text-white px-1 -ml-1 transition-colors"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
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
                    <a
                      href={p.trailer}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        const embed = toEmbedSrc(p.trailer);
                        if (window.innerWidth >= 768 && embed) {
                          e.preventDefault();
                          openVideo(p, embed);
                        }
                      }}
                      className="px-6 py-2 border-2 border-black bg-white text-lg font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer"
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
                    >
                      Trailer
                    </a>
                  )}
                  {p.imdb && (
                    <a
                      href={p.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border-2 border-black bg-white text-lg font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
                      draggable="false"
                      onDragStart={(e) => e.preventDefault()}
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
