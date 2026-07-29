'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Text, Float, ContactShadows, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import { Model as IDCard } from '../Kartu';

function SceneContents() {
  const cardGroupRef = useRef<THREE.Group>(null);
  const text1Ref = useRef<any>(null);
  const text2Ref = useRef<any>(null);

  useEffect(() => {
    if (!cardGroupRef.current || !text1Ref.current || !text2Ref.current) return;

    // Initial State Setup
    gsap.set(cardGroupRef.current.position, { x: 0, y: 0, z: 0 });
    gsap.set(cardGroupRef.current.rotation, { x: 0, y: 0, z: 0 }); 
    
    gsap.set(text1Ref.current.position, { x: 0, y: 0, z: -2 });
    gsap.set(text1Ref.current.fillOpacity, { value: 0 }); 

    gsap.set(text2Ref.current.position, { x: 0, y: 0, z: -2 });
    gsap.set(text2Ref.current.fillOpacity, { value: 0 });

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: false,
    });

    // Sequence 1: ML Engineer text slides out to the Left
    tl.to(text1Ref.current.position, {
      x: -4,
      duration: 1.5,
      ease: 'power2.out',
      delay: 1, // Start after 1 second
    }, "show1");
    tl.to(text1Ref.current, {
      fillOpacity: 1,
      duration: 0.5,
    }, "show1+=0.5");

    // Sequence 2: ML Engineer text slides back in
    tl.to(text1Ref.current.position, {
      x: 0,
      duration: 1.5,
      ease: 'power2.in',
      delay: 2, // Stay visible for 2 seconds
    }, "hide1");
    tl.to(text1Ref.current, {
      fillOpacity: 0,
      duration: 0.5,
    }, "hide1+=1");

    // Sequence 3: Data Engineer text slides out to the Right
    tl.to(text2Ref.current.position, {
      x: 4,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.5, // Small pause before showing next
    }, "show2");
    tl.to(text2Ref.current, {
      fillOpacity: 1,
      duration: 0.5,
    }, "show2+=0.5");
    
    // Sequence 4: Data Engineer text slides back in
    tl.to(text2Ref.current.position, {
      x: 0,
      duration: 1.5,
      ease: 'power2.in',
      delay: 2, // Stay visible for 2 seconds
    }, "hide2");
    tl.to(text2Ref.current, {
      fillOpacity: 0,
      duration: 0.5,
    }, "hide2+=1");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
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
          speed={2} 
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <IDCard scale={2.5} />
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
        color="#38bdf8"
        fillOpacity={0}
      >
        {`ML\nEngineer.`}
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
        color="#0ea5e9"
        fillOpacity={0}
      >
        {`Data\nEngineer.`}
      </Text>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
    </>
  );
}

export function AnimatedIDCardPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full h-screen relative overflow-hidden pointer-events-none z-10">
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
        <SceneContents />
      </Canvas>
    </div>
  );
}
