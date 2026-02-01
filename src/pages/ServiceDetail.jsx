import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../services/service.service';
import { createBooking } from '../services/booking.service';

export default function ServiceDetail(){
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [appointment, setAppointment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getServiceById(id)
      .then(data => setService(data))
      .catch(err => setMessage(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  function bookNow(){
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
      return;
    }
    if(!appointment){
      setMessage('Please pick appointment datetime');
      return;
    }
    createBooking({ appointment_datetime: appointment, service_id: id })
      .then(() => { setMessage('Booking created'); navigate('/bookings'); })
      .catch(err => setMessage(err.response?.data?.message || err.message || 'Booking failed'));
  }

  if(loading) return <div className="p-4 bg-blue-50 min-h-screen">Loading...</div>;
  if(!service) return <div className="p-4 bg-blue-50 min-h-screen">{message || 'Service not found'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <img src={service.image_url || '/vite.svg'} alt={service.name} className="w-full h-96 object-cover rounded-xl border border-blue-100 bg-white" />
          </div>
          <div className="p-4 bg-white rounded-xl shadow border border-blue-100">
            <h1 className="text-2xl font-bold text-blue-700">{service.name}</h1>
            <p className="mt-2 text-blue-600">{service.description}</p>
            <div className="mt-4 text-xl font-semibold text-blue-800">฿{service.price}</div>
            <div className="mt-6">
              <label className="label text-blue-700">Appointment datetime</label>
              <input type="datetime-local" value={appointment} onChange={e=>setAppointment(e.target.value)} className="input input-bordered w-full border-blue-200 focus:border-blue-400" />
              <button className="btn btn-primary mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={bookNow}>Book Now</button>
              {message && <div className="alert mt-4 bg-blue-100 text-blue-700">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
