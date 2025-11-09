import React, { useMemo, useState, useEffect } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import state from '../store';
import TextElement from './TextElement';

const Product = () => {
  const snap = useSnapshot(state);
  const currentProduct = snap.products[snap.currentProduct];
  
  const { nodes, materials } = useGLTF(currentProduct.model);
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // Use useTexture for URL-based images, custom loader for base64
  const defaultLogoTexture = useTexture('./threejs.png');
  const defaultFullTexture = useTexture('./threejs.png');

  // Texture loading with support for both URLs and base64
  const { logoTexture, fullTexture } = useMemo(() => {
    console.log('🔄 Creating textures from decals...');
    
    let logoTex = null;
    let fullTex = null;

    // Handle logo texture
    if (snap.isLogoTexture && snap.logoDecal) {
      if (snap.logoDecal.startsWith('data:image/')) {
        // Base64 data
        logoTex = createTextureFromBase64(snap.logoDecal);
      } else {
        // URL - use the default texture
        logoTex = defaultLogoTexture;
      }
    }

    // Handle full texture
    if (snap.isFullTexture && snap.fullDecal) {
      if (snap.fullDecal.startsWith('data:image/')) {
        // Base64 data
        fullTex = createTextureFromBase64(snap.fullDecal);
      } else {
        // URL - use the default texture
        fullTex = defaultFullTexture;
      }
    }
    
    return { logoTexture: logoTex, fullTexture: fullTex };
  }, [snap.logoDecal, snap.fullDecal, snap.isLogoTexture, snap.isFullTexture, defaultLogoTexture, defaultFullTexture]);

  // Helper function to create texture from base64
  function createTextureFromBase64(base64Data) {
    if (!base64Data || !base64Data.startsWith('data:image/')) {
      console.log('Invalid or non-base64 data, using default texture');
      return null;
    }

    try {
      const texture = new THREE.Texture();
      const image = new Image();
      
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        console.log('✅ Base64 texture loaded successfully');
        texture.image = image;
        texture.needsUpdate = true;
        texture.anisotropy = 16;
        setTexturesLoaded(true);
      };
      
      image.onerror = (error) => {
        console.error('❌ Failed to load base64 texture:', error);
        setTexturesLoaded(true);
      };
      
      image.src = base64Data;
      return texture;
      
    } catch (error) {
      console.error('❌ Error creating texture from base64:', error);
      return null;
    }
  }

  useFrame((state, delta) => {
    const mainMaterial = materials.lambert1 || Object.values(materials)[0];
    if (mainMaterial && mainMaterial.color) {
      easing.dampC(mainMaterial.color, snap.color, 0.25, delta);
    }
  });

  // Reset texture loaded state when decals change
  useEffect(() => {
    setTexturesLoaded(false);
    const timer = setTimeout(() => {
      setTexturesLoaded(true); // Fallback in case textures don't load
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [snap.logoDecal, snap.fullDecal]);

  const mainMesh = nodes.T_Shirt_male || Object.values(nodes).find(node => node.isMesh);

  // Debug logging
  useEffect(() => {
    console.log('🎨 Product State:');
    console.log('   - Product:', snap.currentProduct);
    console.log('   - Logo Decal:', snap.logoDecal ? 'SET' : 'NOT SET');
    console.log('   - Full Decal:', snap.fullDecal ? 'SET' : 'NOT SET');
    console.log('   - Logo Texture:', logoTexture ? 'CREATED' : 'NOT CREATED');
    console.log('   - Full Texture:', fullTexture ? 'CREATED' : 'NOT CREATED');
    console.log('   - isLogoTexture:', snap.isLogoTexture);
    console.log('   - isFullTexture:', snap.isFullTexture);
  }, [snap.currentProduct, snap.logoDecal, snap.fullDecal, logoTexture, fullTexture, snap.isLogoTexture, snap.isFullTexture]);

  const getTextPosition = (index, total) => {
    const basePositions = {
      tshirt: [
        [0, 0.15, 0.15],
        [0, 0.05, 0.15],
        [-0.12, 0.1, 0.15],
        [0.12, 0.1, 0.15]
      ],
      mug: [
        [0, 0.2, 0.05],
        [0.1, 0.15, 0.02],
        [-0.1, 0.15, 0.02]
      ],
      cap: [
        [0, 0.18, 0.1],
        [-0.08, 0.15, 0.12],
        [0.08, 0.15, 0.12]
      ]
    };
    
    const positions = basePositions[snap.currentProduct] || basePositions.tshirt;
    return positions[index % positions.length];
  };

  if (!mainMesh) {
    console.warn('No mesh found in model:', currentProduct.model);
    return null;
  }

  // Determine if we should show decals
  const shouldShowLogoDecal = snap.isLogoTexture && (logoTexture || defaultLogoTexture);
  const shouldShowFullDecal = snap.isFullTexture && (fullTexture || defaultFullTexture);

  return (
    <group 
      scale={currentProduct.scale}
      rotation={currentProduct.rotation}
    >
      {/* Main Product Mesh */}
      <mesh
        castShadow
        receiveShadow
        geometry={mainMesh.geometry}
        material={mainMesh.material}
      >
        {shouldShowFullDecal && (
          <Decal 
            position={currentProduct.decalPositions.full}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture || defaultFullTexture}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        )}

        {shouldShowLogoDecal && (
          <Decal 
            position={currentProduct.decalPositions.logo}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture || defaultLogoTexture}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        )}
      </mesh>

      {/* Text Elements */}
      <group>
        {snap.textElements.map((textObj, index) => (
          <TextElement
            key={textObj.id}
            id={textObj.id}
            text={textObj.text}
            position={getTextPosition(index, snap.textElements.length)}
            color={textObj.color || '#FFFFFF'}
            size={textObj.size || 0.08}
          />
        ))}
      </group>
    </group>
  );
};

// Preload models
useGLTF.preload('/shirt_baked.glb');
useGLTF.preload('/mug.glb');
useGLTF.preload('/cap.glb');

export default Product;