import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center justify-center relative mr-2 w-6 h-9 cursor-pointer active:scale-90 transition-transform ${className}`}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === 'dark' ? 0 : 1,
                    opacity: theme === 'dark' ? 0 : 1,
                    rotate: theme === 'dark' ? 90 : 0
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
            >
                {/* Sun icon for Light Mode (should be visible on white bg -> black) */}
                <Sun size={24} className="text-black" />
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
                {/* Moon icon for Dark Mode (should be visible on dark bg -> white) */}
                <Moon size={24} className="text-white" />
            </motion.div>
        </button>
    )
}
