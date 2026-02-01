import api from './api';

export async function assignBookingForAdmin(bookingId, technician_id) {
  const payload = { technician_id };
  const res = await api.patch(`/api/bookings/${bookingId}/assign-tech`, payload);
  return res.data;
}

export async function createService(payload){
  let config = {};
  if (payload instanceof FormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await api.post('/api/services', payload, config);
  return res.data;
}

export async function updateService(id, payload) {
  let config = {};
  if (payload instanceof FormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' };
  }
  const res = await api.put(`/api/services/${id}`, payload, config);
  return res.data;
}

export async function uploadServiceCover(id, file){
  const form = new FormData();
  form.append('cover', file);
  const res = await api.post(`/api/services/${id}/cover`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function updateUserRole(id, role){
  const res = await api.patch(`/api/users/${id}/role`, { role });
  return res.data;
}

export default { createService, updateService, uploadServiceCover, updateUserRole, assignBookingForAdmin };