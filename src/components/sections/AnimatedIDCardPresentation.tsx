'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, useGLTF, Float, ContactShadows, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger for GSAP
gsap.registerPlugin(ScrollTrigger);

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
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000', // Scroll duration
        scrub: 1, // Smooth scrubbing
        pin: true,
      },
    });

    // Sequence 1: Card comes to center
    tl.to(cardGroupRef.current.position, {
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power2.out',
    }, 0);
    tl.to(cardGroupRef.current.rotation, {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.out',
    }, 0);

    // Sequence 2: Card moves right, Text 1 ("ML Engineer") comes from left
    tl.to(cardGroupRef.current.position, {
      x: 3,
      duration: 1,
      ease: 'power2.inOut',
    }, 1);
    tl.to(cardGroupRef.current.rotation, {
      y: -Math.PI / 6,
      duration: 1,
      ease: 'power2.inOut',
    }, 1);
    
    tl.to(text1Ref.current.position, {
      x: -2,
      z: -2,
      duration: 1,
      ease: 'power2.out',
    }, 1);
    tl.to(text1Ref.current.material, {
      opacity: 1,
      duration: 0.5,
    }, 1);

    // Sequence 3: Card moves left, Text 2 ("Data Engineer") comes from right, Text 1 fades
    tl.to(cardGroupRef.current.position, {
      x: -3,
      duration: 1,
      ease: 'power2.inOut',
    }, 2.5);
    tl.to(cardGroupRef.current.rotation, {
      y: Math.PI / 6,
      duration: 1,
      ease: 'power2.inOut',
    }, 2.5);

    tl.to(text1Ref.current.position, {
      x: -5,
      z: -10,
      duration: 1,
      ease: 'power2.in',
    }, 2.5);
    tl.to(text1Ref.current.material, {
      opacity: 0,
      duration: 0.5,
    }, 2.5);

    tl.to(text2Ref.current.position, {
      x: 2,
      z: -2,
      duration: 1,
      ease: 'power2.out',
    }, 2.5);
    tl.to(text2Ref.current.material, {
      opacity: 1,
      duration: 0.5,
    }, 2.5);
    
    // Sequence 4: Back to center for exit
    tl.to(cardGroupRef.current.position, {
      x: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 4);
    tl.to(cardGroupRef.current.rotation, {
      y: 0,
      duration: 1,
      ease: 'power2.inOut',
    }, 4);

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
        <span>Scroll to Explore</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
      </div>
    </div>
  );
}
