import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Email atau password salah.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-softGray p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-roseTint rounded-2xl text-primary mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h1 className="font-poppins font-bold text-2xl text-slate-800">Admin Login</h1>
          <p className="text-slateGray text-sm mt-2">SESA Dermatology Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slateGray mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary font-inter text-sm"
                placeholder="admin@sesa.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slateGray mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-softGray rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary font-inter text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-darkPink text-white font-poppins font-semibold py-3.5 rounded-xl transition-all shadow-md mt-4 flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;