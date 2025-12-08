import { useEffect } from 'react';

export function useScrollLock(lock) {
    useEffect(() => {
        if (!lock) return;

        // 1. Calculate the width of the scrollbar
        // document.documentElement.clientWidth does not include scrollbar
        // window.innerWidth includes scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        // 2. Save original body style
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

        // 3. Lock scroll and add padding to body
        document.body.style.overflow = 'hidden';
        // Add existing padding + scrollbar width
        // parseInt handles "0px" or "" correctly mostly, but let's be safe
        const currentPadding = parseInt(originalPaddingRight || '0', 10);
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;

        // 4. Handle Fixed Header (Optional/Smart)
        // We target the header specifically. Assuming it's the `header` tag or a specific class.
        // In our case it is <header className="fixed ...">
        const header = document.querySelector('header');
        let originalHeaderPaddingRight = '';
        if (header) {
            originalHeaderPaddingRight = window.getComputedStyle(header).paddingRight;
            const currentHeaderPadding = parseInt(originalHeaderPaddingRight || '0', 10);
            header.style.paddingRight = `${currentHeaderPadding + scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = originalStyle;
            document.body.style.paddingRight = originalPaddingRight;
            if (header) {
                header.style.paddingRight = originalHeaderPaddingRight;
            }
        };
    }, [lock]);
}
