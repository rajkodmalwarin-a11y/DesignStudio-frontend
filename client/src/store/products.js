export const products = {
  tshirt: {
    name: "T-Shirt",
    model: '/shirt_baked.glb',
    price: 29.99,
    decalPositions: {
      logo: [0, 0.04, 0.15],
      full: [0, 0, 0]
    },
    scale: 1,
    rotation: [0, 0, 0]
  },
  mug: {
    name: "Coffee Mug", 
    model: '/mug.glb',
    price: 19.99,
    decalPositions: {
      logo: [0, 0.1, 0.05],
      full: [0, 0.1, 0]
    },
    scale: 0.8,
    rotation: [0, Math.PI / 4, 0]
  },
  cap: {
    name: "Baseball Cap",
    model: '/cap.glb', 
    price: 24.99,
    decalPositions: {
      logo: [0, 0.08, 0.08],
      full: [0, 0, 0]
    },
    scale: 1.2,
    rotation: [0, 0, 0]
  }
};