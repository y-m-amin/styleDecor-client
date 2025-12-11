import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from '../../api/axios';

const ProjectStatus = () => {
  const { state: project } = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState(project?.status || 'assigned');
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await axios.patch(`/decorator/bookings/${project.id}/status`, {
        status,
      });
      navigate('/dashboard/decorator/projects');
    } catch (err) {
      console.error('Failed to update', err);
    } finally {
      setSaving(false);
    }
  };

  if (!project) {
    return <p className='p-5'>No project selected.</p>;
  }

  return (
    <div className='p-5 max-w-lg'>
      <h2 className='text-2xl font-bold mb-4'>Update Project Status</h2>

      <p className='text-gray-600 mb-4'>
        <span className='font-semibold'>Service:</span> {project.service.name}
      </p>

      <select
        className='select select-bordered w-full'
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value='assigned'>Assigned</option>
        <option value='planning_phase'>Planning Phase</option>
        <option value='materials_prepared'>Materials Prepared</option>
        <option value='on_the_way'>On The Way</option>
        <option value='setup_in_progress'>Setup In Progress</option>
        <option value='completed'>Completed</option>
      </select>

      <button
        onClick={updateStatus}
        className='mt-4 bg-blue-600 text-white px-4 py-2 rounded'
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default ProjectStatus;
