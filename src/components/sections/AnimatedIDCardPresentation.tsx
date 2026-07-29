'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, useGLTF, Float, ContactShadows, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
// Removed ScrollTrigger

import { Model as IDCard } from '../Kartu';

export function AnimatedIDCardPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardGroupRef = useRef<THREE.Group>(null);
  const text1Ref = useRef<any>(null);
  const text2Ref = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !cardGroupRef.current || !text1Ref.current || !text2Ref.current) return;

    // Initial State Setup
    gsap.set(cardGroupRef.current.position, { x: 0, y: -2, z: -5 });
    gsap.set(cardGroupRef.current.rotation, { x: Math.PI / 4, y: 0, z: 0 }); // Tilted initially
    
    gsap.set(text1Ref.current.position, { x: -5, y: 0, z: -10 });
    gsap.set(text1Ref.current.material, { opacity: 0 });

    gsap.set(text2Ref.current.position, { x: 5, y: 0, z: -10 });
    gsap.set(text2Ref.current.material, { opacity: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: false,
    });

    // Sequence 1: Center to Right (ML Engineer on Left)
    tl.to(cardGroupRef.current.position, {
      x: 3,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 1, // Stay in center for 1 second
    }, "move1");
    tl.to(cardGroupRef.current.rotation, {
      y: -Math.PI / 6,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "move1");
    
    tl.to(text1Ref.current.position, {
      x: -2,
      z: -2,
      duration: 1.5,
      ease: 'power2.out',
    }, "move1");
    tl.to(text1Ref.current.material, {
      opacity: 1,
      duration: 0.5,
    }, "move1+=1");

    // Sequence 2: Back to Center
    tl.to(cardGroupRef.current.position, {
      x: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 2, // Stay at right for 2 seconds
    }, "center1");
    tl.to(cardGroupRef.current.rotation, {
      y: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "center1");

    tl.to(text1Ref.current.position, {
      x: -5,
      z: -10,
      duration: 1.5,
      ease: 'power2.in',
    }, "center1");
    tl.to(text1Ref.current.material, {
      opacity: 0,
      duration: 0.5,
    }, "center1");

    // Sequence 3: Center to Left (Data Engineer on Right)
    tl.to(cardGroupRef.current.position, {
      x: -3,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 1, // Stay in center for 1 second
    }, "move2");
    tl.to(cardGroupRef.current.rotation, {
      y: Math.PI / 6,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "move2");

    tl.to(text2Ref.current.position, {
      x: 2,
      z: -2,
      duration: 1.5,
      ease: 'power2.out',
    }, "move2");
    tl.to(text2Ref.current.material, {
      opacity: 1,
      duration: 0.5,
    }, "move2+=1");
    
    // Sequence 4: Back to Center
    tl.to(cardGroupRef.current.position, {
      x: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 2, // Stay at left for 2 seconds
    }, "center2");
    tl.to(cardGroupRef.current.rotation, {
      y: 0,
      duration: 1.5,
      ease: 'power2.inOut',
    }, "center2");

    tl.to(text2Ref.current.position, {
      x: 5,
      z: -10,
      duration: 1.5,
      ease: 'power2.in',
    }, "center2");
    tl.to(text2Ref.current.material, {
      opacity: 0,
      duration: 0.5,
    }, "center2");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]"></div>
      
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <SpotLight
          position={[0, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-bias={-0.0001}
        />

        <group ref={cardGroupRef}>
          <Float
            speed={2} // Animation speed, defaults to 1
            rotationIntensity={0.2} // XYZ rotation intensity, defaults to 1
            floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          >
            <IDCard scale={1.5} />
          </Float>
        </group>

        {/* Text 1: ML Engineer */}
        <Text
          ref={text1Ref}
          fontSize={1.2}
          maxWidth={5}
          lineHeight={1}
          letterSpacing={-0.02}
          textAlign="right"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`ML\nEngineer.`}
          <meshStandardMaterial transparent opacity={0} color="#38bdf8" />
        </Text>

        {/* Text 2: Data Engineer */}
        <Text
          ref={text2Ref}
          fontSize={1.2}
          maxWidth={5}
          lineHeight={1}
          letterSpacing={-0.02}
          textAlign="left"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`Data\nEngineer.`}
          <meshStandardMaterial transparent opacity={0} color="#0ea5e9" />
        </Text>

        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
      
      {/* Overlay UI elements if any */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase flex flex-col items-center gap-2">
        <span>↓</span>
      </div>
    </div>
  );
}
