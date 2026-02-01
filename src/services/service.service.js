import api from './api';

export async function getServices(){
  const res = await api.get('/api/services');
  return res.data;
}

export async function getServiceById(id){
  const res = await api.get(`/api/services/${id}`);
  return res.data;
}

export async function deleteService(id){
  const res = await api.delete(`/api/services/${id}`);
  return res.data;
}

export default { getServices, getServiceById, deleteService };