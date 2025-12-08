import { motion } from 'framer-motion'

export default function Reveal({ children, className = '', delay = 0, duration = 0.5 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration, delay: delay * 0.001, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

