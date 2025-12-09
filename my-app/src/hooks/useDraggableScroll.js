import { useState, useRef } from "react";
import { animate } from "framer-motion";

export function useDraggableScroll(itemsLength) {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Physics state
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const velocity = useRef(0);
    const dragDistance = useRef(0);

    const CLICK_THRESHOLD = 10;

    const getItemWidth = () => {
        const container = scrollContainerRef.current;
        if (!container || !container.children[0]) return 0;
        const item = container.querySelector('.project-card-container');
        // Fallback if specific class not found, though usage should ensure it exists or we use child[0]
        return item ? item.offsetWidth + 24 : container.children[0].offsetWidth + 24;
    };

    const handleMouseDown = (e) => {
        if (window.innerWidth < 768 || !scrollContainerRef.current) return;
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
        if (!isDragging || !scrollContainerRef.current) return;
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
        if (!container) return;

        const itemWidth = getItemWidth();
        const currentScroll = container.scrollLeft;

        const inertiaFactor = 300; // ms worth of travel
        const projectedScroll = currentScroll - (velocity.current * inertiaFactor);

        // Snap to nearest item
        const targetIndex = Math.round(projectedScroll / itemWidth);

        // Clamp
        const maxIndex = Math.max(0, itemsLength - 1);
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
            : Math.min(itemsLength - 1, currentIndex + 1);

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

    return {
        scrollContainerRef,
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleMouseLeave,
        scroll,
        wasDrag
    };
}
