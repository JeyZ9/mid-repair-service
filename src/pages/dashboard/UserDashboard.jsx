import { useEffect, useState } from 'react';
const statusMap = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
import { getMyBookings } from '../../services/user.service';

export default function UserDashboard({ user }){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true);
    getMyBookings(user._id)
      .then(data => setBookings(data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, [user._id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 drop-shadow">User Dashboard</h1>
        <p className="mb-4 text-blue-600">Welcome, <strong>{user.name}</strong></p>

        <h2 className="text-xl font-semibold mb-2 text-blue-600">My Bookings</h2>
        {loading ? <div className="text-blue-400">Loading...</div> : bookings.length === 0 ? (
          <div className="alert bg-blue-100 text-blue-700">You have no bookings</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <div key={b._id} className="card p-4 shadow bg-white rounded-xl border border-blue-100">
                <div className="font-bold text-blue-800">Service: {typeof b.service_id === 'object' ? b.service_id?.name : b.service_id || '-'}</div>
                <div className="text-blue-600">Appointment: {new Date(b.appointment_datetime).toLocaleString()}</div>
                <div className="text-blue-400">Status: {statusMap[b.status] || b.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
