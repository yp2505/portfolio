'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { Environment, Text, SpotLight, Lightformer, useTexture, useGLTF } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import gsap from 'gsap';

extend({ MeshLineGeometry, MeshLineMaterial });

// ─── Physics ID Card ───────────────────────────────────────────────────────────
function PhysicsCard({ isMobile }: { isMobile: boolean }) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as any,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF('/assets/kartu.glb') as any;
  const bandTexture = useTexture('/assets/bandd.png');
  const cardTexture = useTexture('/assets/profile_photo.png');
  const { width, height } = useThree((state) => state.size);

  useEffect(() => {
    if (cardTexture) {
      cardTexture.rotation = Math.PI;
      cardTexture.center.set(0.5, 0.5);
      cardTexture.offset.set(-0.2, 0);
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture]);

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
  );

  const [dragged, drag] = useState<any>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const d = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (10 + d * 40));
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      if (band.current?.geometry) band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;

  const cardScale = isMobile ? 1.6 : 2.2;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[0, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={cardScale}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                {...materials.base}
                map={cardTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          transparent
          opacity={0.9}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────────
function SceneContents({ isMobile }: { isMobile: boolean }) {
  const rightTextRef = useRef<THREE.Group>(null);
  const leftTextRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!rightTextRef.current || !leftTextRef.current) return;

    const offscreenX = isMobile ? 12 : 14;
    const targetX = isMobile ? 0 : 3.4;
    const targetY = isMobile ? -2.5 : 0.2;

    // Set initial offscreen positions
    gsap.set(rightTextRef.current.position, { x: offscreenX, y: targetY });
    gsap.set(leftTextRef.current.position, { x: -offscreenX, y: targetY });

    const tl = gsap.timeline({ repeat: -1 });

    // Initial pause while card drops with physics
    tl.to({}, { duration: 1.5 });

    // 1. Slide in Right Panel (ML & Data Engineer) from the right
    tl.to(rightTextRef.current.position, {
      x: targetX,
      duration: 1.4,
      ease: 'power3.out',
    });
    tl.to({}, { duration: 3.5 }); // Display duration

    // 2. Slide out Right Panel back to the right
    tl.to(rightTextRef.current.position, {
      x: offscreenX,
      duration: 1.2,
      ease: 'power3.in',
    });

    tl.to({}, { duration: 0.8 }); // Pause between slides

    // 3. Slide in Left Panel (General Specs) from the left
    tl.to(leftTextRef.current.position, {
      x: -targetX,
      duration: 1.4,
      ease: 'power3.out',
    });
    tl.to({}, { duration: 3.5 }); // Display duration

    // 4. Slide out Left Panel back to the left
    tl.to(leftTextRef.current.position, {
      x: -offscreenX,
      duration: 1.2,
      ease: 'power3.in',
    });

    tl.to({}, { duration: 0.8 }); // Pause before loop restarts

    return () => {
      tl.kill();
    };
  }, [isMobile]);

  const textFontSize = isMobile ? 0.45 : 0.75;
  const labelFontSize = isMobile ? 0.22 : 0.32;

  return (
    <>
      <ambientLight intensity={0.6} />
      <SpotLight position={[0, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-bias={-0.0001} />
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>

      {/* Physics Card centered at world origin */}
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <PhysicsCard isMobile={isMobile} />
      </Physics>

      {/* Right panel — slides in to the right of the card: ML & Data Roles */}
      <group ref={rightTextRef} position={[14, 0.2, -0.5]}>
        <Text
          fontSize={textFontSize * 1.5}
          maxWidth={isMobile ? 3.5 : 5}
          lineHeight={1.1}
          letterSpacing={-0.02}
          textAlign={isMobile ? 'center' : 'left'}
          anchorX={isMobile ? 'center' : 'left'}
          anchorY="middle"
          position={[0, 0.4, 0]}
          color="#38bdf8"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`ML Engineer\n& Data Engineer.`}
        </Text>
        <Text
          fontSize={labelFontSize}
          maxWidth={isMobile ? 3.5 : 4.5}
          lineHeight={1.6}
          textAlign={isMobile ? 'center' : 'left'}
          anchorX={isMobile ? 'center' : 'left'}
          anchorY="middle"
          position={[0, -0.6, 0]}
          color="#6a8aaa"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`Python · TensorFlow · PyTorch\nApache Spark · SQL · scikit-learn`}
        </Text>
      </group>

      {/* Left panel — slides in to the left of the card: General Specs */}
      <group ref={leftTextRef} position={[-14, 0.2, -0.5]}>
        <Text
          fontSize={textFontSize * 1.5}
          maxWidth={isMobile ? 3.5 : 5}
          lineHeight={1.1}
          letterSpacing={-0.02}
          textAlign={isMobile ? 'center' : 'right'}
          anchorX={isMobile ? 'center' : 'right'}
          anchorY="middle"
          position={[0, 0.4, 0]}
          color="#0ea5e9"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`Open to\nOpportunities.`}
        </Text>
        <Text
          fontSize={labelFontSize}
          maxWidth={isMobile ? 3.5 : 4.5}
          lineHeight={1.6}
          textAlign={isMobile ? 'center' : 'right'}
          anchorX={isMobile ? 'center' : 'right'}
          anchorY="middle"
          position={[0, -0.6, 0]}
          color="#6a8aaa"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`Building intelligent data pipelines\nand ML systems that turn raw data\ninto real-world impact.`}
        </Text>
      </group>
    </>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────────
export function AnimatedIDCardPresentation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div
      id="home"
      className="w-full h-[100svh] relative overflow-hidden pointer-events-none z-10"
    >
      <Canvas
        shadows
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 13], fov: 25 }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          pointerEvents: isMobile ? 'none' : 'auto',
        }}
      >
        <SceneContents isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
