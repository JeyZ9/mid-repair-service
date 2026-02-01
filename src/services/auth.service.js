import api from './api';

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
}

export async function register({ name, phone, email, password, confirm_password, role, skill }) {
  const payload = { name, phone, email, password, confirm_password, role };
  if(role === 'technician' && skill) payload.skill = skill;
  const res = await api.post('/api/auth/register', payload);
  return res.data;
}

export default { login, register };