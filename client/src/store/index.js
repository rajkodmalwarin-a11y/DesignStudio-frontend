import { proxy } from 'valtio';
import { products } from './products';

const state = proxy({
  // UI State
  intro: true,
  currentProduct: 'tshirt',
  currentStep: 0,
  
  // Design Properties
  color: '#3B82F6',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/public/threejs.png', // Make sure this path is correct
  fullDecal: 'public/threejs.png', // Make sure this path is correct
  
  // Text Properties
  textElements: [],
  activeText: null,
  
  // Products Catalog
  products: products
});

export default state;