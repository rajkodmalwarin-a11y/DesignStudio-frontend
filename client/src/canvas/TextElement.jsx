import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const TextElement = ({ text, position, color, size = 0.08, id }) => {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      // Very subtle floating animation that doesn't affect positioning
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={size}
      color={color}
      anchorX="center"
      anchorY="middle"
      // Remove font reference to use default
      onPointerEnter={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        document.body.style.cursor = 'default';
      }}
      // Add depth and outline for better visibility
      strokeWidth={0.002}
      strokeColor="#000000"
      strokeOpacity={0.5}
    >
      {text}
    </Text>
  );
};

export default TextElement;