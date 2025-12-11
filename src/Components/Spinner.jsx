export default function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <div className='w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin' />
    </div>
  );
}
