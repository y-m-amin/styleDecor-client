import { motion } from 'motion/react';

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className='h-[60vh] bg-cover bg-center flex flex-col items-center justify-center'
      style={{ backgroundImage: "url('/banner.jpg')" }}
    >
      <h1 className='text-4xl font-bold text-white'>
        Premium Decoration Services
      </h1>
      <button className='mt-6 px-6 py-3 bg-blue-600 text-white rounded'>
        Book Decoration Service
      </button>
    </motion.div>
  );
}
