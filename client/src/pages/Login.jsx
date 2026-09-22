import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, LogIn, Mountain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mountain className="w-8 h-8 text-slate-950" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-bold text-stone-100">Admin Portal</h1>
          </div>
          <p className="text-stone-400 text-sm">Rao Stone Traders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <User className="w-4 h-4 text-amber-500" />
              Username
            </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input-field" placeholder="admin" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-300 mb-2">
              <Lock className="w-4 h-4 text-amber-500" />
              Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="Enter password" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
