import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import SocialLoginButton from '../../components/ui/SocialLoginButton';
import { SOCIAL_PROVIDERS } from '../../lib/socialAuth';

const LoginPage: React.FC = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login, googleLogin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Single redirect point — fires when user state changes
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/profile', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Don't render form while auth is loading or user is already logged in
  if (authLoading || user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // useEffect above will handle redirect
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await googleLogin();
      // useEffect above will handle redirect
    } catch {
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <>
      <Helmet><title>Login | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src="/logo.jpg" alt="Campus School Pantnagar" className="w-14 h-14 rounded-xl object-contain shadow-premium" />
              <div className="text-left">
                <div className="font-black text-primary text-sm uppercase leading-tight">Campus School<br />Pantnagar</div>
                <div className="text-xs text-gray-500">Alumni Portal</div>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-text mt-6 mb-1">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to your alumni account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border border-border/50 p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary" /> Remember me
                </label>
                <Link to="/auth/forgot-password" className="text-sm text-primary font-semibold hover:underline">Forgot Password?</Link>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-60">
                {loading ? 'Signing in...' : <><FiLogIn size={18} /> Sign In</>}
              </button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">or continue with</span></div>
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
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary font-bold hover:underline">Register Now</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
