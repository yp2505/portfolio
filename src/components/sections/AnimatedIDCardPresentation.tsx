'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Text, Float, SpotLight, Lightformer } from '@react-three/drei';
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { extend } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTexture, useGLTF } from '@react-three/drei';

extend({ MeshLineGeometry, MeshLineMaterial });

// ─── Camera Rig ───────────────────────────────────────────────────────────────
// Smoothly lerps the camera to a target X position
function CameraRig({ targetX }: { targetX: number }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Physics ID Card (reuses the existing band component logic) ───────────────
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
            scale={2.25}
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
  const targetXRef = useRef(0);
  const [targetX, setTargetX] = useState(0);

  // Camera pan sequence: center → right → center → left → center (loop)
  useEffect(() => {
    const panDistance = isMobile ? 3 : 6;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(targetXRef, { current: 0, duration: 0, ease: 'none' });
    tl.to({}, { duration: 1.5 }); // hold center
    tl.to(targetXRef, {
      current: panDistance,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => setTargetX(targetXRef.current),
    });
    tl.to({}, { duration: 2.5 }); // hold right
    tl.to(targetXRef, {
      current: 0,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => setTargetX(targetXRef.current),
    });
    tl.to({}, { duration: 1 }); // hold center
    tl.to(targetXRef, {
      current: -panDistance,
      duration: 2.5,
      ease: 'power3.inOut',
      onUpdate: () => setTargetX(targetXRef.current),
    });
    tl.to({}, { duration: 2.5 }); // hold left
    tl.to(targetXRef, {
      current: 0,
      duration: 2,
      ease: 'power3.inOut',
      onUpdate: () => setTargetX(targetXRef.current),
    });

    return () => { tl.kill(); };
  }, [isMobile]);

  const panDistance = isMobile ? 3 : 6;
  const textFontSize = isMobile ? 0.5 : 0.9;
  const labelFontSize = isMobile ? 0.25 : 0.4;

  return (
    <>
      <CameraRig targetX={targetX} />

      <ambientLight intensity={0.5} />
      <SpotLight position={[0, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-bias={-0.0001} />
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>

      {/* Physics Card always at world center */}
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <PhysicsCard isMobile={isMobile} />
      </Physics>

      {/* Right panel — revealed when camera pans RIGHT: ML & Data Roles */}
      <group position={[panDistance, 0, -1]}>
        <Text
          fontSize={textFontSize * 1.8}
          maxWidth={isMobile ? 2.5 : 5}
          lineHeight={1.1}
          letterSpacing={-0.03}
          textAlign="left"
          anchorX="left"
          anchorY="middle"
          position={[0, 0.5, 0]}
          color="#38bdf8"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`ML Engineer\n& Data Engineer.`}
        </Text>
        <Text
          fontSize={labelFontSize}
          maxWidth={isMobile ? 2.5 : 4.5}
          lineHeight={1.7}
          textAlign="left"
          anchorX="left"
          anchorY="middle"
          position={[0, -0.7, 0]}
          color="#6a8aaa"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`Python · TensorFlow · PyTorch\nApache Spark · SQL · scikit-learn`}
        </Text>
      </group>

      {/* Left panel — revealed when camera pans LEFT: General Specs */}
      <group position={[-panDistance, 0, -1]}>
        <Text
          fontSize={textFontSize * 1.8}
          maxWidth={isMobile ? 2.5 : 5}
          lineHeight={1.1}
          letterSpacing={-0.03}
          textAlign="right"
          anchorX="right"
          anchorY="middle"
          position={[0, 0.5, 0]}
          color="#0ea5e9"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {`Open to\nOpportunities.`}
        </Text>
        <Text
          fontSize={labelFontSize}
          maxWidth={isMobile ? 2.5 : 4.5}
          lineHeight={1.7}
          textAlign="right"
          anchorX="right"
          anchorY="middle"
          position={[0, -0.7, 0]}
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
      style={{
        width: '100%',
        height: '100svh',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    >
      <Canvas
        shadows
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 13], fov: 25 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <SceneContents isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
