import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ message, show, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg`}
        >
          <p className="text-sm font-medium text-white">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;