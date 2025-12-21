import { motion } from 'framer-motion';
import { useEffect } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className='min-h-screen bg-base-100 px-4 md:px-10 lg:px-20 py-12'>
      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.6 }}
        className='text-center max-w-3xl mx-auto mb-16'
      >
        <h1 className='text-4xl font-bold mb-4'>About StyleDecor</h1>
        <p className='text-lg opacity-80'>
          Making decoration services smarter, smoother, and stress-free.
        </p>
      </motion.div>

      {/* What is StyleDecor */}
      <motion.section
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='max-w-4xl mx-auto mb-16'
      >
        <h2 className='text-2xl font-semibold mb-4'>What is StyleDecor?</h2>
        <p className='opacity-80 leading-relaxed'>
          StyleDecor is a modern appointment and service management platform for
          a local decoration company offering both in-studio consultations and
          on-site decoration services for homes and ceremonies. It helps
          customers discover decoration packages, book services, and track
          progress — all in one seamless experience.
        </p>
      </motion.section>

      {/* Why StyleDecor */}
      <motion.section
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='max-w-4xl mx-auto mb-16'
      >
        <h2 className='text-2xl font-semibold mb-4'>Why StyleDecor?</h2>
        <ul className='list-disc pl-6 space-y-2 opacity-80'>
          <li>Reduces long waiting times for consultations</li>
          <li>Eliminates manual booking and coordination issues</li>
          <li>Improves decorator assignment and planning</li>
          <li>Provides clear visibility for customers after booking</li>
        </ul>
      </motion.section>

      {/* How it works */}
      <motion.section
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='max-w-5xl mx-auto mb-16'
      >
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          How StyleDecor Works
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='card bg-base-200 p-6'>
            <h3 className='font-semibold text-lg mb-2'>Customer Flow</h3>
            <ul className='list-disc pl-5 space-y-1 opacity-80'>
              <li>Browse decoration packages and services</li>
              <li>Select preferred date and time</li>
              <li>Check decorator availability and expertise</li>
              <li>Make secure payment</li>
              <li>Receive service updates and confirmation</li>
            </ul>
          </div>

          <div className='card bg-base-200 p-6'>
            <h3 className='font-semibold text-lg mb-2'>
              On-Site Service Status
            </h3>
            <ul className='list-decimal pl-5 space-y-1 opacity-80'>
              <li>Assigned</li>
              <li>Planning Phase</li>
              <li>Materials Prepared</li>
              <li>On the Way to Venue</li>
              <li>Setup in Progress</li>
              <li>Completed</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Closing */}
      <motion.div
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='text-center max-w-3xl mx-auto'
      >
        <h2 className='text-2xl font-semibold mb-4'>
          Designed for Better Celebrations
        </h2>
        <p className='opacity-80'>
          StyleDecor bridges the gap between creativity and coordination —
          helping customers enjoy beautiful decorations while businesses operate
          more efficiently.
        </p>
      </motion.div>
    </div>
  );
}
