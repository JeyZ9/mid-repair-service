import UserDashboard from './dashboard/UserDashboard';
import TechnicianDashboard from './dashboard/TechnicianDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
  const { user } = useAuth();

  if(!user) return <div className="p-4">Not authenticated</div>;

  if(user.role === 'admin') return <AdminDashboard user={user} />;
  if(user.role === 'technician') return <TechnicianDashboard user={user} />;
  return <UserDashboard user={user} />;
}
