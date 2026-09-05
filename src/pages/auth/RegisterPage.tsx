import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import SocialLoginButton from '../../components/ui/SocialLoginButton';
import { SOCIAL_PROVIDERS } from '../../lib/socialAuth';

const RegisterPage: React.FC = () => {
  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '', batch: '', school: '' });
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register, googleLogin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Single redirect point
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/profile', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Don't render form while loading or already logged in
  if (authLoading || user) return null;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleGoogle = async () => {
    setError('');
    try {
      await googleLogin();
      // useEffect above will handle redirect
    } catch {
      setError('Google login failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, { full_name: form.name, batch_year: form.batch, school: form.school });
      // useEffect above will handle redirect
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Register | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.jpg" alt="Campus School Pantnagar" className="w-14 h-14 rounded-xl object-contain shadow-premium" />
              <div className="text-left">
                <div className="font-black text-primary text-sm uppercase leading-tight">Campus School<br />Pantnagar</div>
                <div className="text-xs text-gray-500">Alumni Portal</div>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-text mt-6 mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join the Campus School Pantnagar alumni community</p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border border-border/50 p-8">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="text" value={form.name} onChange={set('name')} required placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Batch Year</label>
                  <input type="text" value={form.batch} onChange={set('batch')} placeholder="e.g. 2015"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">School</label>
                <select value={form.school} onChange={set('school')}
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-700">
                  <option value="">Select School</option>
                  <option>Campus School Main Campus</option>
                  <option>Campus School North Wing</option>
                  <option>Campus School Science Block</option>
                  <option>Campus School Arts & Commerce</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  </div>
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 rounded border-border text-primary" />
                I agree to the <Link to="/" className="text-primary font-semibold">Terms of Service</Link> and <Link to="/" className="text-primary font-semibold">Privacy Policy</Link>
              </label>
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-60">
                {loading ? 'Creating Account...' : <><FiUserPlus size={18} /> Create Account</>}
              </button>
            </form>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">or</span></div>
            </div>
            <div className="flex flex-col gap-3">
              {SOCIAL_PROVIDERS.map((p) => (
                <SocialLoginButton
                  key={p.id}
                  provider={p.id}
                  label={p.label}
                  hoverBg={p.hoverBg}
                  configured={p.configured}
                  notConfiguredMessage={p.notConfiguredMessage}
                  onClick={p.id === 'google' ? handleGoogle : async () => {}}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
