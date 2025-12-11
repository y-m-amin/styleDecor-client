import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonCard() {
  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <Skeleton height={160} />
      <div className='mt-3'>
        <Skeleton width={'60%'} height={18} />
        <div className='mt-2 flex items-center justify-between'>
          <Skeleton width={'40%'} height={14} />
          <Skeleton width={60} height={30} />
        </div>
      </div>
    </div>
  );
}
