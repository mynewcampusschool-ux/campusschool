import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password | Campus School Pantnagar Alumni Portal</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-primary" size={28} />
            </div>
            <h1 className="text-2xl font-black text-text mb-1">Reset Password</h1>
            <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
          </div>
          <div className="bg-white rounded-2xl shadow-premium border border-border/50 p-8">
            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-text text-lg mb-2">Email Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">Check your inbox for the password reset link.</p>
                <Link to="/auth/login" className="btn-primary justify-center w-full">Back to Login</Link>
              </div>
            ) : (
              <>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-5">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 disabled:opacity-60">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                <Link to="/auth/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary mt-5 transition-colors">
                  <FiArrowLeft size={14} /> Back to Login
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
