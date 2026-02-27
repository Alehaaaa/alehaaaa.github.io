import { useState } from 'react';
import { HERO_REEL } from '../data/profile';
import DottedMap from './DottedMap';

export default function Hero() {
  const [hoveredCity, setHoveredCity] = useState(null);

  return (
    <section className="relative bg-background pt-10 md:pt-24 overflow-visible z-0">
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        {/* Video Container with Neo-Brutalist Border/Shadow */}
        <div className="relative aspect-video w-full overflow-hidden border-2 border-[color:var(--neo-border)] shadow-[8px_8px_0px_0px_var(--neo-shadow)] bg-black">
          <iframe
            src={HERO_REEL}
            title="Animation demoreel for website"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        <div className="mt-16 text-left pointer-events-none">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-foreground uppercase leading-[1.0] pointer-events-auto inline-block">
            I'm Alejandro<br />
            and I animate.
          </h1>
          <p className="mt-6 text-4xl md:text-6xl font-medium border-l-4 border-[color:var(--neo-border)] pl-6 text-foreground transition-all duration-300 pointer-events-auto">
            From{' '}
            <span
              className="font-extrabold text-foreground transition-all duration-300"
            >
              {hoveredCity ? hoveredCity.name : 'the world'}
            </span>
            , or wherever you are.
          </p>
        </div>
      </div>

      {/* Balanced World Map spacing - shorter on mobile */}
      <div className="relative -mt-24 md:-mt-40 -mb-32 md:-mb-56 h-[450px] md:h-[750px] w-full z-10">
        <DottedMap onHoverCity={setHoveredCity} />
      </div>
    </section>
  );
}
