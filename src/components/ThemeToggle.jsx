import { motion } from 'framer-motion'
import { Sun, Moon, SunMoon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center justify-center relative mr-2 w-8 h-8 cursor-pointer active:scale-95 transition-transform ${className}`}
            aria-label={`Current theme: ${theme}. Click to cycle.`}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'light' ? 1 : 0,
                    opacity: theme === 'light' ? 1 : 0,
                    rotate: theme === 'light' ? 0 : -90
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Sun size={24} className="text-foreground" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'dark' ? 1 : 0,
                    opacity: theme === 'dark' ? 1 : 0,
                    rotate: theme === 'dark' ? 0 : -90
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <Moon size={24} className="text-foreground" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'system' ? 1 : 0,
                    opacity: theme === 'system' ? 1 : 0,
                    rotate: theme === 'system' ? 0 : -90
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                <SunMoon size={24} className="text-foreground" />
            </motion.div>
        </button>
    )
}
