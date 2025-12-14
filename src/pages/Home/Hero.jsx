import { motion } from 'framer-motion';
import { Link } from 'react-router';

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="h-[75vh] bg-cover bg-center relative flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: "url('/banner.jpg')" }}
    >
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-white text-5xl md:text-6xl font-bold drop-shadow-lg"
      >
        Premium Decoration Services
      </motion.h1>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-white text-lg md:text-xl mt-4 max-w-xl drop-shadow"
      >
        Transform your events with stunning, custom decorations designed by our expert team.
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          to="/services"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded shadow transition"
        >
          Book Decoration Service
        </Link>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        className="absolute bottom-8 text-white"
      >
        <span className="text-sm">Scroll down</span>
        <div className="w-1 h-6 mx-auto mt-1 bg-white rounded-full" />
      </motion.div>
    </motion.section>
  );
}
