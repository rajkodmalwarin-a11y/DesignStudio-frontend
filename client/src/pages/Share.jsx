import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomButton from '../components/CustomButton';

const Share = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const designData = JSON.parse(atob(shareId));
      setDesign(designData);
    } catch (error) {
      setError('Invalid or expired design link');
      console.error('Error decoding share URL:', error);
    }
  }, [shareId]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center glassmorphism p-8 rounded-2xl max-w-md"
        >
          <h1 className="text-2xl font-bold text-primary mb-4">Oops!</h1>
          <p className="text-foreground/80 mb-6">{error}</p>
          <CustomButton
            type="filled"
            title="Create New Design"
            handleClick={() => navigate('/')}
            customStyles="w-full"
          />
        </motion.div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/80">Loading design...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism p-8 rounded-2xl max-w-2xl w-full text-center"
      >
        <h1 className="head-text mb-2">Shared Design</h1>
        <p className="text-foreground/80 mb-6">
          This {design.product || 'T-Shirt'} design was created with our 3D customizer
        </p>
        
        <div className="bg-gray-100 rounded-xl p-8 mb-6 flex items-center justify-center min-h-[200px]">
          <p className="text-gray-500">
            3D Preview would be displayed here
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-left">
          <div>
            <p className="text-sm text-foreground/60">Product</p>
            <p className="font-medium capitalize">{design.product || 'T-Shirt'}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/60">Color</p>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: design.color }}
              ></div>
              <p className="font-medium">{design.color}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <CustomButton
            type="outline"
            title="Create Similar"
            handleClick={() => navigate('/')}
            customStyles="flex-1"
          />
          <CustomButton
            type="filled"
            title="Start Customizing"
            handleClick={() => navigate('/')}
            customStyles="flex-1"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Share;