import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth.service';

export default function Register(){
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [skill, setSkill] = useState('');
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  function submit(e){
    e.preventDefault();
    setMsg(null);
    if(password !== confirmPassword){
      setMsg('Passwords do not match');
      return;
    }
    const payload = { name, phone, email, password, confirm_password: confirmPassword, role };
    if(role === 'technician' && skill) payload.skill = skill;
    register(payload)
      .then(() => navigate('/login'))
      .catch(err => setMsg(err.response?.data?.message || err.message || 'Registration failed'));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Create your account</h1>
        {msg && <div className="rounded mb-4 px-3 py-2 bg-red-100 text-red-700 border border-red-200 text-center">{msg}</div>}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" required />
          <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" required />
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" required />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg pr-12" required />
            <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-700" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.67 2.07-3.76 4.06-5.94M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <div className="relative">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg pr-12" required />
            <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-700" onClick={()=>setShowConfirmPassword(v=>!v)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
              {showConfirmPassword ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.67 2.07-3.76 4.06-5.94M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <select className="input input-bordered border-blue-200 focus:border-blue-400 text-blue-800 bg-white w-full h-12 rounded-lg" value={role} onChange={e=>setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="technician">Technician</option>
          </select>
          {role === 'technician' && (
            <input placeholder="Skill (for technician)" value={skill} onChange={e=>setSkill(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" required />
          )}
          <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none">Register</button>
        </form>
        <div className="mt-6 text-center text-blue-600">
          Already have an account?{' '}
          <Link to="/login" className="underline text-blue-700 hover:text-blue-900">Login</Link>
        </div>
      </div>
    </div>
  );
}
