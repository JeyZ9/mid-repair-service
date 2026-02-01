import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getAssignedBookings, updateBooking } from '../../services/technician.service';

const statusMap = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function TechnicianDashboard({ user }){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function load(){
    setLoading(true);
    getAssignedBookings(user._id)
      .then(data => setBookings(data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }

  useEffect(()=>{ load(); }, [user._id]);

  function handleStatus(id, status){
    updateBooking(id, { status })
      .then(()=>{
        Swal.fire('Success', `Booking marked as ${statusMap[status] || status}.`, 'success');
        load();
      })
      .catch(err=>{
        Swal.fire('Error', err.response?.data?.message || err.message || 'Update failed', 'error');
        setMsg(err.response?.data?.message || err.message || 'Update failed');
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 drop-shadow">Technician Dashboard</h1>
        <p className="mb-4 text-blue-600">Hello, <strong>{user.name}</strong></p>
        {msg && <div className="alert alert-error mb-2 bg-blue-100 text-blue-700">{msg}</div>}
        <h2 className="text-xl font-semibold mb-2 text-blue-600">Assigned Bookings</h2>
        {loading ? <div className="text-blue-400">Loading...</div> : bookings.length === 0 ? (
          <div className="alert bg-blue-100 text-blue-700">No assigned bookings</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <div key={b._id} className="card p-4 shadow bg-white rounded-xl border border-blue-100">
                <div className="font-bold text-blue-800">Service: {typeof b.service_id === 'object' ? b.service_id?.name : b.service_id || '-'}</div>
                <div className="text-blue-600">Appointment: {new Date(b.appointment_datetime).toLocaleString()}</div>
                <div className="text-blue-400">Status: {statusMap[b.status] || b.status}</div>
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>handleStatus(b._id, 'completed')}>Mark Completed</button>
                  <button className="btn btn-xs bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" onClick={()=>handleStatus(b._id, 'in_progress')}>In Progress</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
