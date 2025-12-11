import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from '../../api/axios';

const TodaySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchToday = async () => {
    try {
      const res = await axios.get('/decorator/today');
      setSchedule(res.data);
    } catch (err) {
      console.log('Failed fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  if (loading) return <Skeleton count={5} height={70} />;

  return (
    <div className='p-5'>
      <h2 className='text-2xl font-bold mb-4'>Today's Schedule</h2>

      <div className='border-l-4 border-blue-500 pl-4 space-y-6'>
        {schedule.length === 0 && (
          <p className='text-gray-500'>No events scheduled for today.</p>
        )}

        {schedule.map((task) => (
          <div key={task._id} className='relative'>
            <div className='absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full'></div>

            <h3 className='font-semibold'>{task.serviceName}</h3>
            <p className='text-sm text-gray-600'>
              {task.startTime} — {task.endTime}
            </p>
            <p className='text-gray-500'>{task.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySchedule;
