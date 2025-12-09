import { useEffect } from 'react';

export function useScrollLock(lock) {
    useEffect(() => {
        if (!lock) return;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const originalOverflow = document.body.style.overflow;
        const originalPadding = document.body.style.paddingRight;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${parseInt(originalPadding || '0', 10) + scrollbarWidth}px`;

        // Compensate fixed header for scrollbar width
        const header = document.querySelector('header');
        const originalHeaderPadding = header?.style.paddingRight || '';
        if (header) {
            header.style.paddingRight = `${parseInt(originalHeaderPadding || '0', 10) + scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPadding;
            if (header) header.style.paddingRight = originalHeaderPadding;
        };
    }, [lock]);
}
