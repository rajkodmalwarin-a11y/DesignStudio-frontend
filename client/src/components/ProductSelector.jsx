import React from 'react';
import { useSnapshot } from 'valtio';
import { motion } from 'framer-motion';
import state from '../store';

const ProductSelector = () => {
  const snap = useSnapshot(state);

  const products = [
    { key: 'tshirt', icon: '👕', name: 'T-Shirt', color: 'bg-blue-500' },
    { key: 'mug', icon: '☕', name: 'Mug', color: 'bg-green-500' },
    { key: 'cap', icon: '🧢', name: 'Cap', color: 'bg-purple-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 left-6 z-20"
    >
      <div className="product-selector">
        {products.map((product) => (
          <motion.div
            key={product.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`product-card ${
              snap.currentProduct === product.key ? 'active' : ''
            }`}
            onClick={() => {
              state.currentProduct = product.key;
              state.isLogoTexture = true;
              state.isFullTexture = false;
            }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${product.color}`}>
              {product.icon}
            </div>
            <p className="text-xs font-medium text-foreground mt-1">{product.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductSelector;