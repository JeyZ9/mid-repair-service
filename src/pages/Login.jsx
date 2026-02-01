import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  const { loginWithData } = useAuth();
  const [loading, setLoading] = useState(false);

  function submit(e){
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    login(email, password)
      .then(data => {
        const token = data.token?.token || data.token || data.accessToken || null;
        const user = data.user || null;
        if(token){
          loginWithData({ token, user });
          navigate('/');
        } else {
          setMsg('Login succeeded but no token returned');
        }
      })
      .catch(err => setMsg(err.response?.data?.message || err.message || 'Login failed'))
      .finally(()=>setLoading(false));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Sign in to your account</h1>
        {msg && <div className="rounded mb-4 px-3 py-2 bg-red-100 text-red-700 border border-red-200 text-center">{msg}</div>}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input input-bordered border-blue-200 focus:border-blue-400 placeholder-blue-300 text-blue-800 bg-white w-full h-12 rounded-lg" required autoFocus />
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
          <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white text-lg h-12 rounded-lg mt-2 shadow-none" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="mt-6 text-center text-blue-600">
          Don't have an account?{' '}
          <Link to="/register" className="underline text-blue-700 hover:text-blue-900">Register</Link>
        </div>
      </div>
    </div>
  );
}
