import api from './api';

export async function getAllUsers() {
  const res = await api.get('/api/users');
  return res.data;
}

export async function getMyBookings(userId){
  const res = await api.get(`/api/bookings?user_id=${encodeURIComponent(userId)}`);
  return res.data;
}

export default { getAllUsers, getMyBookings };