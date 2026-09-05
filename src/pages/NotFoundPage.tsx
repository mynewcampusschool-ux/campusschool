import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center px-4">
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="text-9xl font-black text-primary/20 mb-4">404</div>
      <h1 className="text-3xl font-black text-text mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary"><FiHome size={16} /> Go Home</Link>
        <button onClick={() => window.history.back()} className="btn-outline bg-gray-800 border-gray-800">
          <FiArrowLeft size={16} /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
