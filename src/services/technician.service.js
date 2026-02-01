import api from './api';

export async function getAssignedBookings(technicianId){
  const res = await api.get(`/api/bookings?technician_id=${encodeURIComponent(technicianId)}`);
  return res.data;
}

export async function assignTechnician(bookingId, technician_id, confirm){
  const payload = { technician_id };
  if(typeof confirm !== 'undefined') payload.confirm = !!confirm;
  const res = await api.patch(`/api/bookings/${bookingId}/assign-tech`, payload);
  return res.data;
}

export async function updateBooking(bookingId, payload){
  const res = await api.put(`/api/bookings/${bookingId}`, payload);
  return res.data;
}

export default { getAssignedBookings, assignTechnician, updateBooking };