import React, { useState, useEffect } from 'react'

/**
 * Logo component that auto-sizes width based on image aspect ratio.
 * Uses background-image to bypass ad-blocker detection.
 */
export function CompanyLogo({ src, name, scale = 1, url }) {
    const [dims, setDims] = useState({ width: 0, height: 0 })
    const heightRem = 3.8 * scale

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            setDims({ width: heightRem * aspectRatio, height: heightRem })
        }
        img.src = src
    }, [src, heightRem])

    // Don't render until we know the dimensions
    if (dims.width === 0) return null

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block p-1 border border-transparent hover:bg-black dark:hover:bg-white transition-colors duration-200"
        >
            <div
                role="img"
                aria-label={name}
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: `${dims.height}rem`,
                    width: `${dims.width}rem`,
                }}
                className="dark:invert-100 group-hover:invert-100 dark:group-hover:invert-0"
            />
        </a>
    )
}
