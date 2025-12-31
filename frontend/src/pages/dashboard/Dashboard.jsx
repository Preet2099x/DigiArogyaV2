import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = authService.getUser();

  useEffect(() => {
    // Redirect based on role
    if (user?.role === 'DOCTOR') {
      navigate('/dashboard/patients', { replace: true });
    } else {
      navigate('/dashboard/records', { replace: true });
    }
  }, [navigate, user?.role]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );
};

export default Dashboard;
