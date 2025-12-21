import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MapFocus({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 12, { animate: true });
  }, [position, map]);

  return null;
}

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/** LOCATIONS */
const locations = [
  {
    type: 'HQ',
    name: 'StyleDecor Corporate Office',
    address: 'Road 12, Gulshan-2, Dhaka 1212',
    phone: '+880 1700 123 456',
    email: 'info@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [23.7937, 90.4066],
  },
  {
    name: 'Chattogram Branch',
    address: 'Agrabad Commercial Area, Chattogram',
    phone: '+880 1700 223 456',
    email: 'ctg@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [22.3569, 91.7832],
  },
  {
    name: 'Khulna Branch',
    address: 'Sonadanga, Khulna',
    phone: '+880 1700 323 456',
    email: 'khulna@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [22.8456, 89.5403],
  },
  {
    name: 'Rajshahi Branch',
    address: 'Shaheb Bazar, Rajshahi',
    phone: '+880 1700 423 456',
    email: 'rajshahi@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [24.3745, 88.6042],
  },
  {
    name: 'Sylhet Branch',
    address: 'Zindabazar, Sylhet',
    phone: '+880 1700 523 456',
    email: 'sylhet@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [24.8949, 91.8687],
  },
  {
    name: 'Barishal Branch',
    address: 'Nathullabad, Barishal',
    phone: '+880 1700 623 456',
    email: 'barishal@styledecor.com',
    hours: 'Mon – Sat | 9:00 AM – 6:00 PM',
    position: [22.701, 90.3535],
  },
];

export default function Contact() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (!data.name?.trim()) {
      toast.error('Please enter your name');
      return;
    }

    toast.success('Your query has been submitted successfully!');
    reset();
  };

  const [activePos, setActivePos] = useState(locations[0].position);

  const focusMap = (pos) => {
    setActivePos(pos);
  };

  const headOffice = locations.find((l) => l.type === 'HQ');
  const branches = locations.filter((l) => l.type !== 'HQ');

  return (
    <>
      <div className='min-h-screen px-4 md:px-10 lg:px-20 py-12'>
        {/* PAGE HEADER */}
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='opacity-80'>
            Visit our corporate office or any of our branch locations across
            Bangladesh.
          </p>
        </div>

        {/* HEAD OFFICE */}

        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='flex justify-center mb-12'
        >
          <div className='card bg-base-200 shadow-lg p-6 max-w-xl w-full text-center'>
            <h2 className='text-xl font-semibold mb-2'>{headOffice.name}</h2>
            <p>{headOffice.address}</p>
            <p className='mt-2'>📞 {headOffice.phone}</p>
            <p>✉️ {headOffice.email}</p>
            <p className='mt-1'>🕒 {headOffice.hours}</p>

            <a
              href={`https://www.google.com/maps?q=${headOffice.position[0]},${headOffice.position[1]}`}
              target='_blank'
              rel='noreferrer'
              className='btn btn-link mt-2'
            >
              View on Google Maps
            </a>
          </div>
        </motion.div>

        {/* BRANCHES */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='bg-base-300 rounded-lg p-6 mb-12'
        >
          <h3 className='text-2xl font-semibold mb-6 text-center'>
            Branch Offices
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {branches.map((b, i) => (
              <div
                key={i}
                className='card bg-base-100 shadow-md p-5 cursor-pointer hover:shadow-lg transition'
                onClick={() => focusMap(b.position)}
              >
                <h4 className='font-semibold mb-1'>{b.name}</h4>
                <p className='text-sm'>{b.address}</p>
                <p className='text-sm mt-2'>📞 {b.phone}</p>
                <p className='text-sm'>✉️ {b.email}</p>
                <p className='text-sm mt-1'>🕒 {b.hours}</p>

                <a
                  href={`https://www.google.com/maps?q=${b.position[0]},${b.position[1]}`}
                  target='_blank'
                  rel='noreferrer'
                  className='text-sm text-primary mt-2 inline-block'
                >
                  View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MAP */}
        <div className='h-[450px] rounded-lg overflow-hidden shadow-lg mb-16'>
          <MapContainer
            center={activePos}
            zoom={6}
            scrollWheelZoom={false}
            className='h-full w-full'
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />

            <MapFocus position={activePos} />

            {locations.map((loc, i) => (
              <Marker key={i} position={loc.position}>
                <Popup>
                  <strong>{loc.name}</strong>
                  <br />
                  {loc.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      <motion.div
        variants={fadeUp}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.6 }}
        className='max-w-3xl mx-auto bg-base-200 p-8 rounded-lg shadow-lg'
      >
        <h3 className='text-2xl font-semibold mb-6 text-center'>
          Send Us a Message
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid grid-cols-1 md:grid-cols-2 gap-5'
        >
          {/* Name */}
          <div className='md:col-span-2'>
            <input
              type='text'
              placeholder='Your Name'
              className='input input-bordered w-full'
              {...register('name', { required: true })}
            />
            {errors.name && (
              <p className='text-error text-sm mt-1'>Name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type='email'
              placeholder='Email Address'
              className='input input-bordered w-full'
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className='text-error text-sm mt-1'>Email is required</p>
            )}
          </div>

          {/* Inquiry Type */}
          <div>
            <select
              className='select select-bordered w-full'
              {...register('interest', { required: true })}
            >
              <option value=''>What are you looking for?</option>
              <option value='service'>Interested in decoration services</option>
              <option value='hire'>Looking for a decorator</option>
              <option value='decorator'>
                I am a decorator looking for customers
              </option>
              <option value='other'>Other inquiry</option>
            </select>
            {errors.interest && (
              <p className='text-error text-sm mt-1'>Please select an option</p>
            )}
          </div>

          {/* Message */}
          <div className='md:col-span-2'>
            <textarea
              placeholder='Write your message...'
              className='textarea textarea-bordered w-full min-h-[120px]'
              {...register('message', { required: true })}
            />
            {errors.message && (
              <p className='text-error text-sm mt-1'>Message is required</p>
            )}
          </div>

          {/* Submit */}
          <div className='md:col-span-2 text-center mt-4'>
            <button type='submit' className='btn btn-accent px-10'>
              Submit Message
            </button>
          </div>
        </form>

        <ToastContainer position='top-right' autoClose={3000} />
      </motion.div>
    </>
  );
}
