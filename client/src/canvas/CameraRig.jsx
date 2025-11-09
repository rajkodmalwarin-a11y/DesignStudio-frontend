import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);
  const { camera } = useThree();

  // Manual recenter functionality
  useEffect(() => {
    const handleRecenter = () => {
      const productPositions = {
        tshirt: [0, 0, 2.5],
        mug: [0, 0, 2.8],
        cap: [0, 0.1, 2.7]
      };
      
      const targetPosition = productPositions[snap.currentProduct] || [0, 0, 2.5];
      camera.position.set(...targetPosition);
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener('recenter-camera', handleRecenter);
    return () => window.removeEventListener('recenter-camera', handleRecenter);
  }, [camera, snap.currentProduct]);

  useFrame((state, delta) => {
    // Fixed camera positioning - doesn't change based on content
    const isMobile = window.innerWidth < 768;
    
    const productPositions = {
      tshirt: [0, 0, 2.5],
      mug: [0, 0, 2.8],
      cap: [0, 0.1, 2.7]
    };
    
    const targetPosition = productPositions[snap.currentProduct] || [0, 0, 2.5];

    // Smooth camera movement to fixed position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    // Gentle rotation based on mouse position - independent of content
    if (group.current) {
      easing.dampE(
        group.current.rotation,
        [state.pointer.y * 0.05, -state.pointer.x * 0.1, 0],
        0.25,
        delta
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;