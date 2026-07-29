'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Text, Float, ContactShadows, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

import { Model as IDCard } from '../Kartu';

function SceneContents() {
  const cardGroupRef = useRef<THREE.Group>(null);
  const contentGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Responsive sizing based on viewport width
  const isMobile = viewport.width < 5;
  const cardScale = isMobile ? 1.5 : 2.5;
  const textSize = isMobile ? 0.8 : 1.4;
  const textOffset = isMobile ? 3 : 5; // Distance of text from center

  useEffect(() => {
    if (!cardGroupRef.current || !contentGroupRef.current) return;

    // Reset initial states
    gsap.killTweensOf([cardGroupRef.current.position, contentGroupRef.current.position]);

    // Initial State Setup
    // Card drops from top
    gsap.set(cardGroupRef.current.position, { x: 0, y: 10, z: 0 });
    gsap.set(cardGroupRef.current.rotation, { x: 0, y: 0, z: 0 }); 
    
    // Content group starts centered
    gsap.set(contentGroupRef.current.position, { x: 0, y: 0, z: -2 });

    const tl = gsap.timeline();

    // 1. Initial Card Drop (Physics-like bounce)
    tl.to(cardGroupRef.current.position, {
      y: 0,
      duration: 1.5,
      ease: 'bounce.out',
    });

    // 2. Continuous Panning Loop
    const loopTl = gsap.timeline({ repeat: -1 });

    // Stay at center for a bit
    loopTl.to({}, { duration: 1 });

    // Pan right (Move content group left, so Right text comes to center)
    loopTl.to(contentGroupRef.current.position, {
      x: -textOffset,
      duration: 2,
      ease: 'power3.inOut',
    });

    // Stay looking at right text
    loopTl.to({}, { duration: 2 });

    // Pan left (Move content group right, so Left text comes to center)
    loopTl.to(contentGroupRef.current.position, {
      x: textOffset,
      duration: 3,
      ease: 'power3.inOut',
    });

    // Stay looking at left text
    loopTl.to({}, { duration: 2 });

    // Return to center
    loopTl.to(contentGroupRef.current.position, {
      x: 0,
      duration: 2,
      ease: 'power3.inOut',
    });

    // Add the loop timeline to the main timeline after the drop
    tl.add(loopTl);

    return () => {
      tl.kill();
      loopTl.kill();
    };
  }, [textOffset]);

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
          <IDCard scale={cardScale} />
        </Float>
      </group>

      <group ref={contentGroupRef}>
        {/* Left Side Text: ML & Data Engineer */}
        <Text
          position={[-textOffset, 0, 0]}
          fontSize={textSize}
          maxWidth={isMobile ? 3 : 5}
          lineHeight={1}
          letterSpacing={-0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="#38bdf8"
        >
          {`ML & Data\nEngineer.`}
        </Text>

        {/* Right Side Text: General Specs */}
        <Text
          position={[textOffset, 0, 0]}
          fontSize={textSize}
          maxWidth={isMobile ? 3 : 5}
          lineHeight={1}
          letterSpacing={-0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
          color="#0ea5e9"
        >
          {`Building\nIntelligent\nSystems.`}
        </Text>
      </group>

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
      
      {/* Overlay UI elements if any */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase flex flex-col items-center gap-2">
        <span>↓</span>
      </div>
    </div>
  );
}
