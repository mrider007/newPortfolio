export function LoadingFallback() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 10px rgba(0, 255, 255, 0.6)',
              '0 0 20px rgba(0, 255, 255, 0.8)',
              '0 0 10px rgba(0, 255, 255, 0.6)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="p-6 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 229, 255, 0.5), rgba(0, 229, 255, 0.8))',
          }}
        >
          <Loader size={50} className="text-cyan-500 animate-spin" />
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0.6 }}
          animate={{ y: [-10, 10], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mt-4 text-cyan-400 text-lg font-semibold neon-text"
        >
          Loading, please wait...
        </motion.div>
      </div>
    );
  }