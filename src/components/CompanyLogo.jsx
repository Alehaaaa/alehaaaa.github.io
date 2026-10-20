import React, { useState, useEffect } from 'react'

/**
 * Logo component that auto-sizes width based on image aspect ratio.
 * Uses background-image to bypass ad-blocker detection.
 */
export function CompanyLogo({ src, name, scale = 1, url }) {
    const [dims, setDims] = useState({ width: 0, height: 0 })
    const [failed, setFailed] = useState(false)
    const heightRem = 3.8 * scale

    useEffect(() => {
        setDims({ width: 0, height: 0 })
        setFailed(false)
        if (!src) {
            setFailed(true)
            return
        }

        const img = new Image()
        img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight
            setDims({ width: heightRem * aspectRatio, height: heightRem })
        }
        img.onerror = () => setFailed(true)
        img.src = src
    }, [src, heightRem])

    const Wrapper = url ? 'a' : 'span'
    const wrapperProps = url
        ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
        : {}

    return (
        <Wrapper
            {...wrapperProps}
            className="group inline-block p-1 border border-transparent hover:bg-black dark:hover:bg-white transition-colors duration-200"
        >
            {failed ? (
                <span className="inline-flex min-h-12 items-center text-sm font-black uppercase tracking-tight text-foreground">
                    {name}
                </span>
            ) : (
                <div
                    role="img"
                    aria-label={name}
                    style={{
                        backgroundImage: dims.width ? `url(${src})` : undefined,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: `${heightRem}rem`,
                        width: `${dims.width || heightRem * 1.8}rem`,
                    }}
                    className="dark:invert-100 group-hover:invert-100 dark:group-hover:invert-0"
                />
            )}
        </Wrapper>
    )
}
