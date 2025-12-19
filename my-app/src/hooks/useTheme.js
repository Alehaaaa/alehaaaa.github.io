import { useState, useEffect } from 'react'

let query
let isDark = false
let refs = 0

const handleThemeChange = (e) => {
    isDark = e.matches
    // If we want to notify React components of changes to 'isDark' (for useTheme), we can do it here.
    // However, lightDark values update themselves via valueOf().
}

// FinalizationRegistry to clean up the listener when no lightDark values are in use
const colors = typeof FinalizationRegistry !== 'undefined' ? new FinalizationRegistry(() => {
    if (--refs <= 0 && query) {
        query.removeEventListener('change', handleThemeChange)
        query = undefined
    }
}) : null

export const lightDark = (light, dark) => {
    if (typeof window === 'undefined') return light

    if (!query) {
        query = window.matchMedia('(prefers-color-scheme: dark)')
        isDark = query.matches
        query.addEventListener('change', handleThemeChange)
    }

    // We only use the registry if it exists and we have a query
    if (query) {
        const color = Object.assign('', {
            valueOf: () => (query.matches ? dark : light), // Use query.matches directly to be safe, or isDark
            toString: () => (query.matches ? dark : light),
            [Symbol.toPrimitive]: (hint) => {
                const val = query.matches ? dark : light
                return hint === 'number' ? Number(val) : val
            }
        })

        if (colors) {
            colors.register(color, null)
            refs++
        }

        return color
    }

    return light
}

export function useTheme() {
    // Initialize state
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme')
            if (savedTheme) return savedTheme
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    })

    useEffect(() => {
        console.log('Theme changed to:', theme)
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            // If user chose system, we need to defer to matchMedia
            // But currently 'theme' state purely holds 'light' or 'dark' in the original code,
            // except the original code referenced handling 'system' in the effect? 
            // Wait, the original initialization logic (lines 4-17) returns 'light' or 'dark' or 'savedTheme'.
            // But line 26 checks `theme === 'system'`. So 'system' IS a possible state 
            // if the user SETS it to 'system'. But the initializer didn't seem to return it?
            // Ah, checking line 6: `localStorage.getItem('theme')` could be 'system'.

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const applySystem = (e) => {
                const sysTheme = e.matches ? 'dark' : 'light'
                root.classList.remove('light', 'dark')
                root.classList.add(sysTheme)
            }

            applySystem(mediaQuery)
            mediaQuery.addEventListener('change', applySystem)
            return () => mediaQuery.removeEventListener('change', applySystem)
        } else {
            root.classList.add(theme)
            localStorage.setItem('theme', theme)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return { theme, toggleTheme }
}
