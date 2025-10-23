import React from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import { projects } from "../lib/utils";
import LightboxVideo, { toEmbedSrc } from "./LightboxVideo";
import LightboxImage from "./LightboxImage";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function Projects() {
  const gap = 24;
  const total = projects.length;
  const pageRef = React.useRef(null);
  const viewportRef = React.useRef(null);

  const [videoOpen, setVideoOpen] = React.useState(false);
  const [videoSrc, setVideoSrc] = React.useState(null);
  const [videoTitle, setVideoTitle] = React.useState("");
  const [imageOpen, setImageOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [imageAlt, setImageAlt] = React.useState("");

  const [layout, setLayout] = React.useState({
    visible: 2,
    slideWidth: 0,
    leadingPadding: 0,
    trailingPadding: 0,
  });

  const [index, setIndex] = React.useState(0);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const programmaticScrollRef = React.useRef(null);

  const { visible, slideWidth, leadingPadding, trailingPadding } = layout;
  const stepSize = slideWidth + gap;
  const maxIndex = Math.max(0, total - visible);
  const trailingInset = visible > 1 ? gap : 0;

  const measure = React.useCallback(() => {
    const vp = viewportRef.current;
    const page = pageRef.current;
    if (!vp || !page) return;

    const vpWidth = vp.getBoundingClientRect().width;
    const cs = window.getComputedStyle(page);
    const basePadding = parseFloat(cs.paddingLeft) || 0;

    let newVisible;
    if (vpWidth < 768) newVisible = 1;
    else if (vpWidth < 1500) newVisible = 2;
    else newVisible = 3;

    const contentWidth = vpWidth - basePadding * 2;
    let width = 0;
    let lead = basePadding;
    let trail = basePadding;

    if (newVisible === 1) {
      width = contentWidth - gap * 2;
      lead = basePadding + gap;
      trail = basePadding + gap;
    } else if (newVisible === 2) {
      width = (contentWidth - gap) / 2;
    } else {
      width = (contentWidth - gap * 2) / 3;
    }

    setLayout((prev) => {
      if (
        prev.visible === newVisible &&
        prev.slideWidth === width &&
        prev.leadingPadding === lead &&
        prev.trailingPadding === trail
      )
        return prev;
      return {
        visible: newVisible,
        slideWidth: width,
        leadingPadding: lead,
        trailingPadding: trail,
      };
    });
  }, [gap]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure]);

  React.useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const scrollToIndex = React.useCallback(
    (i) => {
      const clamped = clamp(i, 0, maxIndex);
      const vp = viewportRef.current;
      if (!vp || stepSize <= 0) return;
      programmaticScrollRef.current = clamped;
      vp.scrollTo({ left: clamped * stepSize, behavior: "smooth" });
      setIndex(clamped);
    },
    [maxIndex, stepSize]
  );

  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return undefined;
    const onScroll = () => {
      const left = vp.scrollLeft;
      setScrollPosition(left);
      if (stepSize <= 0) return;
      const targetIndex = programmaticScrollRef.current;
      if (targetIndex !== null) {
        const targetLeft = targetIndex * stepSize;
        const diff = left - targetLeft;
        const threshold = Math.max(1, stepSize * 0.1);
        if (Math.abs(diff) <= threshold) {
          programmaticScrollRef.current = null;
          setIndex(targetIndex);
        } else if (Math.abs(diff) > stepSize * 1.25) {
          programmaticScrollRef.current = null;
          const derivedFallback = clamp(Math.round(left / stepSize), 0, maxIndex);
          setIndex((prev) => (prev === derivedFallback ? prev : derivedFallback));
        }
        return;
      }
      const derived = clamp(Math.round(left / stepSize), 0, maxIndex);
      setIndex((prev) => (prev === derived ? prev : derived));
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [stepSize, maxIndex]);

  const next = () => scrollToIndex(index + 1);
  const prev = () => scrollToIndex(index - 1);

  // Used to vertically align arrow buttons with the image center
  const imageMidY = React.useMemo(() => {
    if (!slideWidth) return "50%";
    // Each image is aspect 4/3, so height = width * 3/4
    const imageHeight = slideWidth * 0.75;
    return `${imageHeight / 2 + 12}px`; // 24px accounts for the bottom margin (mb-6)
  }, [slideWidth]);

  React.useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || stepSize <= 0) return;
    if (programmaticScrollRef.current !== null) return;
    const target = index * stepSize;
    vp.scrollTo({ left: target, behavior: "auto" });
    setScrollPosition(vp.scrollLeft);
  }, [index, stepSize]);

  return (
    <section id="projects" className="py-40 bg-white" style={{ overflowX: "hidden" }}>
      <div ref={pageRef} className="max-w-7xl mx-auto px-4">
        <Reveal className="text-left mb-16">
          <h2 className="text-6xl md:text-7xl font-light text-black mb-4">
            Projects
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div
          ref={viewportRef}
          className="overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden"
          style={{
            scrollPaddingLeft: `${leadingPadding}px`,
            scrollPaddingRight: `${trailingPadding + trailingInset}px`,
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorX: "contain",
          }}
        >
          <div
            className="flex items-stretch"
            style={{
              paddingLeft: `${leadingPadding}px`,
              paddingRight: `${trailingPadding + trailingInset}px`,
              gap: `${gap}px`,
            }}
          >
            {projects.map((p, i) => {
              const activeIndex = stepSize > 0 ? Math.round(scrollPosition / stepSize) : 0;
              const left = clamp(activeIndex, 0, total - visible);
              const right = left + visible - 1;

              // Distance in "slides" from the current focus
              const distance = Math.abs(activeIndex - i);
              const inside = i >= left && i <= right;

              // Slides in view keep full opacity, others fade to 0.7
              const opacity = inside ? 1 : clamp(1 - Math.min(distance, 1) * 0.3, 0.7, 1);
              return (
                <div
                  key={i}
                  className="flex-none group transition-opacity duration-200 h-full"
                  style={{
                    width: `${slideWidth}px`,
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    opacity,
                  }}
                >
                  <div className="flex h-full flex-col">
                    <div
                      className="aspect-[4/3] overflow-hidden mb-6 bg-gray-200"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setImageSrc(p.image);
                        setImageAlt(p.title);
                        setImageOpen(true);
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                      />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-medium text-black mb-2">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    {[p.type, p.role].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-black">
                    {p.trailer && (
                      <a
                        href={p.trailer}
                        onClick={(e) => {
                          e.preventDefault();
                          const embed = toEmbedSrc(p.trailer);
                          if (embed) {
                            setVideoSrc(embed);
                            setVideoTitle(p.title);
                            setVideoOpen(true);
                          } else {
                            window.open(p.trailer, "_blank", "noopener,noreferrer");
                          }
                        }}
                        className="font-medium text-xl underline"
                      >
                        Trailer
                      </a>
                    )}
                    {p.imdb && (
                      <a
                        href={p.imdb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-xl underline"
                      >
                        IMDb
                      </a>
                    )}
                    {p.companyUrl && (
                      <>
                        <span className="mx-1 text-black">|</span>
                        <a
                          href={p.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl no-underline font-light hover:opacity-80"
                        >
                          {p.companyDisplayName || p.companyName || "Company"}
                        </a>
                      </>
                    )}
                  </div>
                  <div className="mt-auto flex justify-end pt-6">
                    {/* <Link
                      to={`/projects/${p.slug}`}
                      className="inline-flex items-center justify-center border border-black px-5 py-1 text-xs font-medium uppercase tracking-[0.3em] text-black transition-colors duration-200 hover:bg-black hover:text-white"
                    >
                      More...
                    </Link> */}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="absolute left-0 z-20 flex items-center justify-center text-black disabled:opacity-40"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous"
          style={{
            top: imageMidY,
            transform: "translateY(-50%)",
            height: "auto",
            width: "7.5%",
          }}
        >
          <svg
            className="h-6 w-[44px]"
            viewBox="0 0 44 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.90649 16.96L2.1221 9.17556L9.9065 1.39116"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M42.8633 9.18125L3.37868 9.18125"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <button
          className="absolute right-0 z-20 flex items-center justify-center text-black disabled:opacity-40"
          onClick={next}
          disabled={index === maxIndex}
          aria-label="Next"
          style={{
            top: imageMidY,
            transform: "translateY(-50%)",
            height: "auto",
            width: "7.5%",
          }}
        >
          <svg
            className="h-6 w-[44px]"
            viewBox="0 0 44 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34.0935 1.39116L41.8779 9.17556L34.0935 16.96"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M41.1213 9.18125L1.63672 9.18125"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <LightboxVideo
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={videoSrc}
        title={`Trailer for ${videoTitle}`}
      />
      <LightboxImage
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        src={imageSrc}
        alt={`Poster for ${imageAlt}`}
      />
    </section>
  );
}
