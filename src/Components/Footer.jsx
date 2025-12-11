export default function Footer() {
  return (
    <footer className='bg-gray-50 border-t mt-16'>
      <div className='container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div>
          <h4 className='font-semibold'>StyleDecor</h4>
          <p className='text-sm text-gray-600 mt-2'>
            Transforming spaces — weddings, homes, offices and events.
          </p>
        </div>

        <div>
          <h5 className='font-semibold'>Contact</h5>
          <p className='text-sm text-gray-600 mt-2'>Phone: +880-1XX-XXXXXXX</p>
          <p className='text-sm text-gray-600'>Email: info@style-decor.com</p>
          <p className='text-sm text-gray-600 mt-2'>
            Hours: Mon - Sat | 9:00 - 18:00
          </p>
        </div>

        <div>
          <h5 className='font-semibold'>Follow</h5>
          <div className='flex gap-3 mt-3'>
            <a className='text-sm text-gray-600'>Facebook</a>
            <a className='text-sm text-gray-600'>Instagram</a>
            <a className='text-sm text-gray-600'>LinkedIn</a>
          </div>
        </div>
      </div>

      <div className='bg-white border-t'>
        <div className='container mx-auto px-4 py-4 text-center text-sm text-gray-500'>
          © {new Date().getFullYear()} StyleDecor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
