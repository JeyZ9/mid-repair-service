import api from './api';

function buildQuery(params){
  if(!params) return '';
  const keys = Object.keys(params);
  if(keys.length === 0) return '';
  return '?' + keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
}

export async function getBookings(params){
  const q = buildQuery(params);
  const res = await api.get(`/api/bookings${q}`);
  return res.data;
}

export async function createBooking(payload){
  const res = await api.post('/api/bookings', payload);
  return res.data;
}

export async function getBookingById(id){
  const res = await api.get(`/api/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id){
  const res = await api.patch(`/api/bookings/${id}/cancel`);
  return res.data;
}

export default { getBookings, createBooking, getBookingById, cancelBooking };