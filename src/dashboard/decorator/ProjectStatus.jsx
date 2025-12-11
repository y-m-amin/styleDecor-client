import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from '../../api/axios';

const ProjectStatus = () => {
  const { state: project } = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState(project?.status || 'pending');
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await axios.patch(`/decorator/project/${project._id}`, { status });
      navigate('/dashboard/decorator/projects');
    } catch (err) {
      console.log('Failed to update', err);
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
        <span className='font-semibold'>Service:</span> {project.serviceName}
      </p>

      <select
        className='select select-bordered w-full'
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value='pending'>Pending</option>
        <option value='in-progress'>In Progress</option>
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
