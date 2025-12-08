import { useCallback } from 'react';

export function useScroll(offset = 0) {
    const scrollTo = useCallback((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, [offset]);

    return scrollTo;
}
