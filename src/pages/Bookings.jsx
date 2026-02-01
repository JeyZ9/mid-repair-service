import { useEffect, useState } from 'react';
import { getBookings, cancelBooking } from '../services/booking.service';

export default function Bookings(){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function load(){
    setLoading(true);
    getBookings()
      .then(data => setBookings(data || []))
      .catch(err => setMsg(err.message || 'Failed to load'))
      .finally(()=>setLoading(false));
  }

  useEffect(()=>{ load(); }, []);

  function handleCancelBooking(id){
    cancelBooking(id)
      .then(()=> load())
      .catch(err => setMsg(err.response?.data?.message || err.message || 'Cancel failed'));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-700 drop-shadow">My Bookings</h1>
        {msg && <div className="alert alert-error bg-blue-100 text-blue-700">{msg}</div>}
        {loading ? (
          <div className="text-blue-400">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="alert bg-blue-100 text-blue-700">No bookings found</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <div key={b._id} className="card p-4 shadow bg-white rounded-xl border border-blue-100 flex justify-between">
                <div>
                  <div className="font-bold text-blue-800">Service: {b.service_id?.name || '-'}</div>
                  <div className="text-blue-600">Appointment: {new Date(b.appointment_datetime).toLocaleString()}</div>
                  <div className="text-blue-400">Status: {b.status}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-sm btn-error bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" onClick={()=>handleCancelBooking(b._id)}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
