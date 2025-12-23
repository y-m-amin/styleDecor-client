import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io5';
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className='bg-base-200 border-t mt-16'>
      <div className='container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Brand */}
        <div>
          <h4 className='text-lg font-semibold'>StyleDecor</h4>
          <p className='text-sm opacity-70 mt-2'>
            Transforming spaces for weddings, homes, offices, and special events
            with creativity and care.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h5 className='font-semibold mb-2'>Contact Us</h5>
          <p className='text-sm opacity-70'>📞 +880 1700 123 456</p>
          <p className='text-sm opacity-70'>✉️ info@styledecor.com</p>
          <p className='text-sm opacity-70 mt-2'>
            🕒 Mon – Sat: 9:00 AM – 6:00 PM
          </p>
        </div>

        {/* Social */}
        <div>
          <h5 className='font-semibold mb-2'>Follow Us</h5>
          <div className='flex gap-4 text-sm opacity-70'>
            <a
              href='https://www.facebook.com'
              className='hover:text-primary text-2xl'
            >
              <FaFacebookSquare />
            </a>
            <a href='https://www.instagram.com' className='hover:text-primary text-2xl'>
              <IoLogoInstagram />
            </a>
            <a href='https://www.linkedin.com/' className='hover:text-primary text-2xl'>
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='border-t bg-base-100'>
        <div className='container mx-auto px-4 py-4 text-center text-sm opacity-60'>
          © {new Date().getFullYear()} StyleDecor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
