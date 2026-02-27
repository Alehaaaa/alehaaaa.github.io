import React, { useEffect, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { projects } from '../data/projects';

const WORLD_DATA_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

// Get locations from projects data, filter projects that have locations and are not disabled
const EXTRA_LOCATIONS = projects
    .filter(p => p.location && !p.disabled)
    .map(p => ({
        name: p.location.name,
        coords: [p.location.long, p.location.lat]
    }));

// Deduplicate locations by name to avoid overlapping points at same city
const LOCATIONS = Array.from(new Map(EXTRA_LOCATIONS.map(l => [l.name, l])).values());

// Fallback if no locations found
if (LOCATIONS.length === 0) {
    LOCATIONS.push({ name: 'Barcelona', coords: [2.1734, 41.3851] });
}

export default function DottedMap({ onHoverCity }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const dotsRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const suppressionRef = useRef(0);
    const lastHoveredCityRef = useRef(null);

    // Handle Resize accurately
    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Initialize dots on dimension change
    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        let isCancelled = false;

        async function loadAndInit() {
            try {
                const response = await fetch(WORLD_DATA_URL);
                const worldData = await response.json();
                if (isCancelled) return;

                const countries = topojson.feature(worldData, worldData.objects.countries);

                const lons = LOCATIONS.map(l => l.coords[0]);
                const lats = LOCATIONS.map(l => l.coords[1]);

                // Box around highlighted dots - more zoomed in
                const marginDeg = 8;
                const minLon = Math.min(...lons) - marginDeg;
                const maxLon = Math.max(...lons) + marginDeg;
                const minLat = Math.min(...lats) - marginDeg;
                const maxLat = Math.max(...lats) + marginDeg;

                // Use MultiPoint of corners for fitExtent with tighter padding
                const boundsFeature = {
                    type: "MultiPoint",
                    coordinates: [[minLon, minLat], [maxLon, maxLat]]
                };

                const projection = d3Geo.geoMercator()
                    .fitExtent([[20, 20], [dimensions.width - 20, dimensions.height - 20]], boundsFeature);
                const scale = projection.scale();

                // Proportions: target 18 pixels distance
                const targetPixelDist = 18;
                const pixelsPerDegree = scale * (Math.PI / 180);
                const dotDensity = targetPixelDist / pixelsPerDegree;
                const baseDotRadius = 1.8;

                const generatedDots = [];
                const targetPoints = LOCATIONS.map(loc => {
                    const params = projection(loc.coords);
                    const [x, y] = params || [0, 0];
                    return { x, y, name: loc.name, closestDist: Infinity, closestIdx: -1 };
                });

                const edgeMargin = Math.min(dimensions.width, dimensions.height) * 0.05;

                // FASTER LAND DETECTION: offscreen canvas pixel sampling
                const hiddenCanvas = document.createElement('canvas');
                hiddenCanvas.width = dimensions.width;
                hiddenCanvas.height = dimensions.height;
                const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

                if (hiddenCtx) {
                    const pathGenerator = d3Geo.geoPath().projection(projection).context(hiddenCtx);
                    hiddenCtx.fillStyle = '#000';
                    hiddenCtx.fillRect(0, 0, dimensions.width, dimensions.height);
                    hiddenCtx.fillStyle = '#fff';
                    hiddenCtx.beginPath();
                    pathGenerator(countries);
                    hiddenCtx.fill();

                    const imgDataArr = hiddenCtx.getImageData(0, 0, dimensions.width, dimensions.height).data;

                    // Iterate over the entire valid world range to fill the full viewport
                    for (let lat = 85; lat >= -85; lat -= dotDensity) {
                        for (let lon = -180; lon <= 180; lon += dotDensity) {
                            const params = projection([lon, lat]);
                            if (!params) continue;
                            const [x, y] = params;

                            if (x >= 0 && x < dimensions.width && y >= 0 && y < dimensions.height) {
                                const pxIndex = (Math.floor(y) * dimensions.width + Math.floor(x)) * 4;
                                const isLand = imgDataArr[pxIndex] > 128;

                                if (isLand) {
                                    const distToEdgeX = Math.min(x, dimensions.width - x);
                                    const distToEdgeY = Math.min(y, dimensions.height - y);
                                    const edgeFactor = Math.pow(Math.min(1, Math.min(distToEdgeX, distToEdgeY) / edgeMargin), 1.5);

                                    const dotIdx = generatedDots.length;
                                    generatedDots.push({
                                        x, y,
                                        isHighlight: false,
                                        currentScale: 1,
                                        targetScale: 1,
                                        baseAlpha: 0.2,
                                        currentAlpha: 0.2,
                                        radius: baseDotRadius * edgeFactor
                                    });

                                    targetPoints.forEach(tp => {
                                        const d = Math.hypot(tp.x - x, tp.y - y);
                                        if (d < tp.closestDist) {
                                            tp.closestDist = d;
                                            tp.closestIdx = dotIdx;
                                        }
                                    });
                                }
                            }
                        }
                    }
                }

                targetPoints.forEach(tp => {
                    if (tp.closestIdx !== -1) {
                        const dot = generatedDots[tp.closestIdx];
                        dot.isHighlight = true;
                        dot.name = tp.name;
                        dot.baseAlpha = 1;
                        dot.radius = baseDotRadius * 2.5; // Even larger unhovered highlights
                    }
                });

                if (!isCancelled) {
                    dotsRef.current = generatedDots;
                }
            } catch (error) {
                console.error('Error loading map data:', error);
            }
        }

        loadAndInit();
        return () => { isCancelled = true; };
    }, [dimensions]);

    // Animation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;
            const hoverRadius = 200;
            let currentHoveredCity = null;

            // Check for city hover
            for (const dot of dotsRef.current) {
                if (dot.isHighlight) {
                    const dist = Math.hypot(dot.x - mouseX, dot.y - mouseY);
                    if (dist < 30) {
                        currentHoveredCity = { name: dot.name, x: dot.x, y: dot.y };
                        break;
                    }
                }
            }

            const isDark = document.documentElement.classList.contains('dark');

            const targetSuppression = currentHoveredCity ? 1 : 0;
            suppressionRef.current += (targetSuppression - suppressionRef.current) * 0.1;

            // Draw normal dots
            for (const dot of dotsRef.current) {
                if (dot.isHighlight) continue;

                const dist = Math.hypot(dot.x - mouseX, dot.y - mouseY);
                const rawFactor = Math.max(0, 1 - dist / hoverRadius);
                const softFactor = Math.pow(rawFactor, 2) * (1 - suppressionRef.current);

                dot.targetScale = 1 + softFactor * 1.5;
                dot.targetAlpha = 0.4 + softFactor * 0.5;

                dot.currentScale += (dot.targetScale - dot.currentScale) * 0.08;
                dot.currentAlpha += (dot.targetAlpha - dot.currentAlpha) * 0.08;

                ctx.beginPath();
                // Make dots slightly larger in light mode for better contrast
                const responsiveRadius = isDark ? dot.radius : dot.radius * 1.35;
                ctx.arc(dot.x, dot.y, responsiveRadius * dot.currentScale, 0, Math.PI * 2);

                if (isDark) {
                    const colorVal = Math.floor(180 + softFactor * 60);
                    ctx.fillStyle = `rgba(${colorVal}, ${colorVal}, ${colorVal}, ${dot.currentAlpha})`;
                } else {
                    const colorVal = Math.floor(120 - softFactor * 100);
                    ctx.fillStyle = `rgba(${colorVal}, ${colorVal}, ${colorVal}, ${dot.currentAlpha})`;
                }
                ctx.fill();
            }

            // Draw highlights on top
            for (const dot of dotsRef.current) {
                if (!dot.isHighlight) continue;

                const dist = Math.hypot(dot.x - mouseX, dot.y - mouseY);
                const rawFactor = Math.max(0, 1 - dist / hoverRadius);
                const softFactor = Math.pow(rawFactor, 2); // Highlights ignore suppression for their own ripple

                const isThisCityHovered = currentHoveredCity?.name === dot.name;
                const rippleScale = 1 + softFactor * 1.2; // Slightly reduced ripple
                dot.targetScale = (isThisCityHovered ? 2.5 : 1) * rippleScale; // Smaller zoom on hover
                dot.targetAlpha = 1;

                dot.currentScale += (dot.targetScale - dot.currentScale) * 0.12;
                dot.currentAlpha += (dot.targetAlpha - dot.currentAlpha) * 0.12;

                ctx.beginPath();
                // Use the dot's own radius which is already larger for highlights
                ctx.arc(dot.x, dot.y, dot.radius * dot.currentScale, 0, Math.PI * 2);
                ctx.fillStyle = isDark ? '#fff' : '#000';
                ctx.fill();
            }

            if (onHoverCity && currentHoveredCity?.name !== lastHoveredCityRef.current?.name) {
                lastHoveredCityRef.current = currentHoveredCity;
                onHoverCity(currentHoveredCity);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, onHoverCity]);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const handleMouseLeave = () => {
        mouseRef.current = { x: -1000, y: -1000 };
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-background overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="block w-full h-full"
            />

            {/* Top Fade overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            {/* Bottom Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}
