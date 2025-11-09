import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Product from './Product';
import Backdrop from './Backdrop';
import CameraRig from './CameraRig';

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 3], fov: 25 }}
      gl={{ 
        preserveDrawingBuffer: true,
        // Add these to fix warnings
        outputColorSpace: 'srgb'
      }}
      className="w-full h-full"
    >
      {/* Simple lighting that always works */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
      />
      
      <CameraRig>
        <Backdrop />
        <Product />
      </CameraRig>
      
      {/* User controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        enableDamping={true}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
};

export default CanvasModel;