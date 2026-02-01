import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="navbar bg-blue-100 shadow-md">
      <div className="flex-1 px-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl text-blue-700 hover:bg-blue-200">Home Repair</Link>
      </div>
      <div className="flex-none gap-2">
        {!user ? (
          <>
            <Link to="/" className="btn btn-ghost text-blue-700 hover:bg-blue-200">Services</Link>
            <Link to="/login" className="btn btn-primary bg-blue-500 border-blue-500 hover:bg-blue-600 text-white">Login</Link>
            <Link to="/register" className="btn bg-white border-blue-200 text-blue-700 hover:bg-blue-50">Register</Link>
          </>
        ) : (
          <>
            <Link to="/" className="btn btn-ghost text-blue-700 hover:bg-blue-200">Services</Link>
            <Link to="/bookings" className="btn btn-ghost text-blue-700 hover:bg-blue-200">Bookings</Link>
            <Link to="/dashboard" className="btn btn-ghost text-blue-700 hover:bg-blue-200">Dashboard</Link>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-blue-700">{user.name}</span>
              <span className="badge badge-outline border-blue-400 text-blue-700 bg-white">{user.role}</span>
              <button className="btn btn-outline btn-sm border-blue-400 text-blue-700 hover:bg-blue-100" onClick={onLogout}>Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
