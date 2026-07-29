'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { Environment, Lightformer, useTexture, useGLTF } from '@react-three/drei';
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
import { motion, AnimatePresence } from 'framer-motion';

extend({ MeshLineGeometry, MeshLineMaterial });

// ─── 3D Physics Card ───────────────────────────────────────────────────────────
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
    if (hovered && !isMobile) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged, isMobile]);

  useFrame((state, delta) => {
    if (dragged && card.current && !isMobile) {
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
              if (isMobile) return;
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              if (isMobile) return;
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

// ─── Root Component ────────────────────────────────────────────────────────────
export function AnimatedIDCardPresentation() {
  const [isMobile, setIsMobile] = useState(false);
  const [panelState, setPanelState] = useState<'right' | 'left' | 'none'>('right');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Continuous panel loop: right -> none -> left -> none -> repeat
  useEffect(() => {
    const interval = setInterval(() => {
      setPanelState((prev) => {
        if (prev === 'right') return 'none';
        if (prev === 'none') return 'left';
        return 'right';
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const skills = ["Python", "TensorFlow", "PyTorch", "Apache Spark", "SQL", "scikit-learn"];

  return (
    <section
      id="home"
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D Canvas Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: isMobile ? 'none' : 'auto',
        }}
      >
        <Canvas
          gl={{ alpha: true }}
          camera={{ position: [0, 0, 13], fov: 25 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <Environment blur={0.75}>
            <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
            <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>

          <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
            <PhysicsCard isMobile={isMobile} />
          </Physics>
        </Canvas>
      </div>

      {/* HTML Motion Panels overlayed around the 3D card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1200,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '100px 24px 40px' : '0 60px',
          pointerEvents: 'none',
        }}
      >
        {/* Left Side Panel — revealed on 'left' state */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <AnimatePresence mode="wait">
            {panelState === 'left' && (
              <motion.div
                initial={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -80, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  maxWidth: isMobile ? '100%' : 420,
                  padding: '24px 28px',
                  borderRadius: 24,
                  background: 'rgba(8, 15, 26, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(14, 165, 233, 0.25)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono), monospace',
                    color: '#38bdf8',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 999,
                    border: '1px solid rgba(14,165,233,0.3)',
                    background: 'rgba(14,165,233,0.08)',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#38bdf8',
                      boxShadow: '0 0 8px #38bdf8',
                    }}
                  />
                  Open to Opportunities
                </div>

                <h2
                  style={{
                    fontSize: isMobile ? 28 : 36,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: '#ffffff',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.03em',
                    marginBottom: 12,
                  }}
                >
                  Building Scalable<br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Data & ML Systems
                  </span>
                </h2>

                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(232,244,255,0.7)',
                    lineHeight: 1.7,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Transforming complex datasets into high-impact machine learning models and robust data engineering pipelines.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side Panel — revealed on 'right' state */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <AnimatePresence mode="wait">
            {panelState === 'right' && (
              <motion.div
                initial={{ opacity: 0, x: 80, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 80, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  pointerEvents: 'auto',
                  maxWidth: isMobile ? '100%' : 420,
                  padding: '24px 28px',
                  borderRadius: 24,
                  background: 'rgba(8, 15, 26, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(14, 165, 233, 0.25)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  textAlign: 'right',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    fontFamily: 'var(--font-mono), monospace',
                    color: '#38bdf8',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: 999,
                    border: '1px solid rgba(14,165,233,0.3)',
                    background: 'rgba(14,165,233,0.08)',
                    marginBottom: 16,
                  }}
                >
                  Primary Roles
                </div>

                <h2
                  style={{
                    fontSize: isMobile ? 28 : 36,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: '#ffffff',
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: '-0.03em',
                    marginBottom: 16,
                  }}
                >
                  ML Engineer &amp;<br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Data Engineer
                  </span>
                </h2>

                {/* Tech Stack Badges */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'flex-end',
                  }}
                >
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontSize: 12,
                        padding: '5px 12px',
                        borderRadius: 10,
                        background: 'rgba(14, 165, 233, 0.12)',
                        border: '1px solid rgba(14, 165, 233, 0.25)',
                        color: '#38bdf8',
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
