import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Support() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Our support team will contact you shortly.',
      confirmButtonColor: '#22c55e',
      theme: 'dark',
    });

    e.target.reset();
  };

  return (
    <div className='min-h-screen bg-base-200 py-14 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-5xl mx-auto'
      >
        {/* Header */}
        <div className='text-center mb-10'>
          <h1 className='text-3xl md:text-4xl font-extrabold text-primary'>
            Contact Support
          </h1>
          <p className='mt-2 text-base-content/60'>
            We’re here to help you 24/7
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-5'
          >
            <div className='card bg-base-100 shadow-md'>
              <div className='card-body space-y-4'>
                <h2 className='text-xl font-bold'>Support Contacts</h2>

                <div className='flex items-center gap-3'>
                  <FaEnvelope className='text-primary text-xl' />
                  <span>support@styledecorteam.xyz</span>
                </div>

                <div className='flex items-center gap-3'>
                  <FaPhoneAlt className='text-primary text-xl' />
                  <span>+880 1256 2649269</span>
                </div>

                <div className='flex items-center gap-3'>
                  <FaWhatsapp className='text-success text-xl' />
                  <span>+880 1984 9597449</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Support Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='card bg-base-100 shadow-md'
          >
            <div className='card-body'>
              <h2 className='text-xl font-bold mb-4'>Send us a message</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='label font-semibold'>Name</label>
                  <input
                    type='text'
                    required
                    className='input input-bordered w-full'
                    placeholder='Your name'
                  />
                </div>

                <div>
                  <label className='label font-semibold'>Email</label>
                  <input
                    type='email'
                    required
                    className='input input-bordered w-full'
                    placeholder='your@email.com'
                  />
                </div>

                <div>
                  <label className='label font-semibold'>Message</label>
                  <textarea
                    required
                    className='textarea textarea-bordered w-full h-28'
                    placeholder='How can we help you?'
                  />
                </div>

                <button type='submit' className='btn btn-primary w-full'>
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
