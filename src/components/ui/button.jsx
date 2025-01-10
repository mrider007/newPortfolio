import { motion } from "framer-motion";

export const Button = ({ onClick, children, variant = 'primary' ,className='' }) => (
  <motion.button
    onClick={onClick}
    initial={{ boxShadow: '0 0 25px 5px rgba(0, 229, 255, 0.2)' }}
    className={`px-8 py-6 rounded-full font-medium flex items-center gap-2 ${
      variant === 'primary'
        ? 'bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90'
        : 'border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 border'
    } ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);