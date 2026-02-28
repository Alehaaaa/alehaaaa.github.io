import React, { useEffect, useState, useRef } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { projects } from '../data/projects';

// --- Configuration ---
const WORLD_DATA_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

const MAP_CONFIG = {
    dotDensity: 18, // Target pixel distance between dots
    baseDotRadius: 1.8,
    mapPaddingPercentage: 0.05, // Viewport border margin
    mapOffsetYPercentage: 0.1, // Shift the map down the viewport height
    geographicMarginPercent: 0.3, // Geographic margin proportional to coordinate spread
    minDegreesSpread: 15, // Minimum coordinate spread to avoid over-zooming
    highlight: {
        unhoveredScale: 3.2,
        hoveredZoomFactor: 2.0,
        rippleScale: 1.2,
        hitRadius: 30, // Pixel distance to trigger city hover
    },
    normalDots: {
        hoverRadius: 200,
        zoomFactor: 1.5,
        baseAlpha: 0.4,
        hoverAlphaAdd: 0.5,
        dark: { base: 160, hoverAdd: 50 },  // Luminosity ranges (0-255)
        light: { base: 100, hoverSub: 80 }
    },
    animation: {
        transitionSpeed: 0.08,
        highlightSpeed: 0.12,
        suppressionSpeed: 0.1,
    }
};

// --- Data Preparation ---
const getActiveLocations = () => {
    const locations = projects
        .filter(p => p.location && !p.disabled)
        .map(p => ({ name: p.location.name, coords: [p.location.long, p.location.lat] }));

    const unique = Array.from(new Map(locations.map(l => [l.name, l])).values());
    return unique.length > 0 ? unique : [{ name: 'Barcelona', coords: [2.1734, 41.3851] }];
};

const LOCATIONS = getActiveLocations();

// --- Helper Functions ---
function getLandDetectionData(width, height, countries, projection) {
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = width;
    hiddenCanvas.height = height;
    const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const pathGenerator = d3Geo.geoPath().projection(projection).context(ctx);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    pathGenerator(countries);
    ctx.fill();

    return ctx.getImageData(0, 0, width, height).data;
}

// --- Main Component ---
export default function DottedMap({ onHoverCity }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const dotsRef = useRef([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const suppressionRef = useRef(0);
    const lastHoveredCityRef = useRef(null);

    // Handle Resize
    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            setDimensions(entry.contentRect);
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Initialize dots on dimension change
    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;
        let isCancelled = false;

        const initMap = async () => {
            try {
                const worldData = await fetch(WORLD_DATA_URL).then(r => r.json());
                if (isCancelled) return;

                const countries = topojson.feature(worldData, worldData.objects.countries);

                // Projection setup
                const lons = LOCATIONS.map(l => l.coords[0]);
                const lats = LOCATIONS.map(l => l.coords[1]);

                // Enforce minimum spread to avoid over-zoom
                const enforceSpread = (min, max) => {
                    if (max - min >= MAP_CONFIG.minDegreesSpread) return [min, max];
                    const center = (min + max) / 2, half = MAP_CONFIG.minDegreesSpread / 2;
                    return [center - half, center + half];
                };

                const [minLon, maxLon] = enforceSpread(Math.min(...lons), Math.max(...lons));
                const [minLat, maxLat] = enforceSpread(Math.min(...lats), Math.max(...lats));

                // Clamp with margins
                const mX = (maxLon - minLon) * MAP_CONFIG.geographicMarginPercent;
                const mY = (maxLat - minLat) * MAP_CONFIG.geographicMarginPercent;

                const boundsFeature = {
                    type: "MultiPoint",
                    coordinates: [
                        [Math.max(-180, minLon - mX), Math.max(-85, minLat - mY)],
                        [Math.min(180, maxLon + mX), Math.min(85, maxLat + mY)]
                    ]
                };

                const padX = Math.max(dimensions.width * MAP_CONFIG.mapPaddingPercentage, 40);
                const padY = Math.max(dimensions.height * MAP_CONFIG.mapPaddingPercentage, 40);
                const padYTop = padY + (dimensions.height * MAP_CONFIG.mapOffsetYPercentage);

                const projection = d3Geo.geoMercator()
                    .fitExtent([[padX, padYTop], [dimensions.width - padX, dimensions.height - padY]], boundsFeature);

                const scale = projection.scale();
                const dotDensityStep = MAP_CONFIG.dotDensity / (scale * (Math.PI / 180));

                const landDataArr = getLandDetectionData(dimensions.width, dimensions.height, countries, projection);
                if (!landDataArr) return;

                const targetPoints = LOCATIONS.map(loc => {
                    const [x, y] = projection(loc.coords) || [0, 0];
                    return { x, y, name: loc.name, closestDist: Infinity, closestIdx: -1 };
                });

                const edgeMargin = Math.min(dimensions.width, dimensions.height) * 0.05;
                const generatedDots = [];

                // Generate dots grid
                for (let lat = 85; lat >= -85; lat -= dotDensityStep) {
                    for (let lon = -180; lon <= 180; lon += dotDensityStep) {
                        const coords = projection([lon, lat]);
                        if (!coords) continue;
                        const [x, y] = coords;

                        if (x >= 0 && x < dimensions.width && y >= 0 && y < dimensions.height) {
                            const pxIndex = (Math.floor(y) * dimensions.width + Math.floor(x)) * 4;
                            if (landDataArr[pxIndex] > 128) {
                                const distToEdge = Math.min(x, dimensions.width - x, y, dimensions.height - y);
                                const edgeFactor = Math.pow(Math.min(1, distToEdge / edgeMargin), 1.5);

                                generatedDots.push({
                                    x, y,
                                    isHighlight: false,
                                    currentScale: 1, targetScale: 1,
                                    baseAlpha: 0.2, currentAlpha: 0.2,
                                    radius: MAP_CONFIG.baseDotRadius * edgeFactor
                                });

                                const dotIdx = generatedDots.length - 1;
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

                // Apply highlights
                targetPoints.forEach(tp => {
                    if (tp.closestIdx !== -1) {
                        const dot = generatedDots[tp.closestIdx];
                        dot.isHighlight = true;
                        dot.name = tp.name;
                        dot.radius = MAP_CONFIG.baseDotRadius * MAP_CONFIG.highlight.unhoveredScale;
                    }
                });

                if (!isCancelled) dotsRef.current = generatedDots;
            } catch (err) { console.error('Map init error:', err); }
        };

        initMap();
        return () => { isCancelled = true; };
    }, [dimensions]);

    // Animation Loop
    useEffect(() => {
        if (!canvasRef.current || dimensions.width === 0) return;
        const ctx = canvasRef.current.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId;

        const render = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            const { x: mouseX, y: mouseY } = mouseRef.current;
            const isDark = document.documentElement.classList.contains('dark');

            // Theme Colors
            const foregroundStr = containerRef.current ? getComputedStyle(containerRef.current).color : (isDark ? 'rgb(255,255,255)' : 'rgb(0,0,0)');
            const [fr, fg, fb] = (foregroundStr.match(/\d+/g) || [255, 255, 255]).map(Number);
            const maxF = Math.max(fr, fg, fb, 1);
            const rgbColor = `rgb(${fr}, ${fg}, ${fb})`;

            // Config Shortcuts
            const nConf = MAP_CONFIG.normalDots;
            const hConf = MAP_CONFIG.highlight;
            const anim = MAP_CONFIG.animation;
            const theme = isDark ? nConf.dark : nConf.light;
            const radMulti = isDark ? 1 : 1.35;

            // Hovered City Detection & Suppression
            const hoveredCity = dotsRef.current.find(d => d.isHighlight && Math.hypot(d.x - mouseX, d.y - mouseY) < hConf.hitRadius);

            suppressionRef.current += ((hoveredCity ? 1 : 0) - suppressionRef.current) * anim.suppressionSpeed;
            const currSupp = suppressionRef.current;

            // Draw Dots (Unified Loop)
            dotsRef.current.forEach(dot => {
                const isCity = dot.isHighlight;
                const dist = Math.hypot(dot.x - mouseX, dot.y - mouseY);
                const softFactor = Math.pow(Math.max(0, 1 - dist / nConf.hoverRadius), 2);

                if (!isCity) {
                    const suppSoft = softFactor * (1 - currSupp);
                    dot.targetScale = 1 + suppSoft * nConf.zoomFactor;
                    dot.targetAlpha = nConf.baseAlpha + suppSoft * nConf.hoverAlphaAdd;

                    const colorVal = isDark ? (theme.base + suppSoft * theme.hoverAdd) : (theme.base - suppSoft * theme.hoverSub);
                    const scale = colorVal / maxF;
                    ctx.fillStyle = `rgba(${Math.floor(fr * scale)}, ${Math.floor(fg * scale)}, ${Math.floor(fb * scale)}, ${dot.currentAlpha})`;
                } else {
                    const isHovered = hoveredCity?.name === dot.name;
                    dot.targetScale = (isHovered ? hConf.hoveredZoomFactor : 1) * (1 + softFactor * hConf.rippleScale);
                    ctx.fillStyle = rgbColor;
                }

                dot.currentScale += (dot.targetScale - dot.currentScale) * (isCity ? anim.highlightSpeed : anim.transitionSpeed);
                if (!isCity) dot.currentAlpha += (dot.targetAlpha - dot.currentAlpha) * anim.transitionSpeed;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius * dot.currentScale * (isCity ? 1 : radMulti), 0, Math.PI * 2);
                ctx.fill();
            });

            // Trigger Callback
            if (onHoverCity && hoveredCity?.name !== lastHoveredCityRef.current?.name) {
                lastHoveredCityRef.current = hoveredCity;
                onHoverCity(hoveredCity ? { name: hoveredCity.name, x: hoveredCity.x, y: hoveredCity.y } : null);
            }
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, onHoverCity]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-background overflow-hidden"
            onMouseMove={e => {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }}
            onMouseLeave={() => mouseRef.current = { x: -1000, y: -1000 }}>
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="block w-full h-full" />

            {/* Fade Overlays */}
            <div className="absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}
