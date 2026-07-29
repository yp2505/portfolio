'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
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

extend({ MeshLineGeometry, MeshLineMaterial });

// ─── Helper: Generate Compact, Tight Horizontal Card Textures (1200 x 700) ─────
function createHorizontalCardTexture(type: 'left' | 'right'): THREE.CanvasTexture {
  if (typeof window === 'undefined') return new THREE.CanvasTexture(null as any);

  const canvas = window.document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(null as any);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 700);
  bgGrad.addColorStop(0, '#0a182e');
  bgGrad.addColorStop(0.5, '#050d1a');
  bgGrad.addColorStop(1, '#02050d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 700);

  // Grid pattern
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.05)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1200; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 700);
    ctx.stroke();
  }
  for (let y = 0; y < 700; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  // Outer border & glow frame
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
  ctx.lineWidth = 12;
  ctx.strokeRect(18, 18, 1164, 664);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, 1136, 636);

  const leftMargin = 60;

  if (type === 'left') {
    // ── LEFT CARD: GENERAL SPECS ──
    // Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 50, 360, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(leftMargin + 26, 74, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText('OPEN TO OPPORTUNITIES', leftMargin + 44, 81);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 44px "Inter", sans-serif';
    ctx.fillText('Building Scalable Data & ML Systems', leftMargin, 150);

    // Divider
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 185);
    ctx.lineTo(1140, 185);
    ctx.stroke();

    // Description text (compact spacing)
    ctx.fillStyle = 'rgba(232, 244, 255, 0.88)';
    ctx.font = '400 28px "Inter", sans-serif';
    ctx.fillText('Transforming complex datasets into high-impact machine learning models', leftMargin, 250);
    ctx.fillText('and robust, production-ready data engineering pipelines.', leftMargin, 295);

    // Highlight Quote
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.font = 'italic 26px "Inter", sans-serif';
    ctx.fillText('"Turning raw data into scalable intelligence."', leftMargin, 400);

  } else {
    // ── RIGHT CARD: ROLES & TECH STACK ──
    // Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 50, 260, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 20px "Inter", sans-serif';
    ctx.fillText('PRIMARY ROLES', leftMargin + 32, 81);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 44px "Inter", sans-serif';
    ctx.fillText('ML Engineer & Data Engineer', leftMargin, 150);

    // Divider
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 185);
    ctx.lineTo(1140, 185);
    ctx.stroke();

    // Skills Badges (Compact horizontal row)
    const skills = ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'SQL', 'scikit-learn'];
    let startX = leftMargin;
    const y = 250;

    skills.forEach((skill) => {
      ctx.font = '600 24px "Inter", sans-serif';
      const tw = ctx.measureText(skill).width;
      const bw = tw + 36;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.beginPath();
      ctx.roundRect(startX, y, bw, 52, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(skill, startX + 18, y + 35);
      startX += bw + 14;
    });

    ctx.fillStyle = 'rgba(232, 244, 255, 0.82)';
    ctx.font = '400 26px "Inter", sans-serif';
    ctx.fillText('End-to-End Model Architecture & Distributed ETL Pipelines.', leftMargin, 400);
  }

  // Footer
  ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.font = '500 24px "JetBrains Mono", monospace';
  ctx.fillText('yug.dev', leftMargin, 630);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── Single Physics 3D ID Card Component ──────────────────────────────────────
function SinglePhysicsCard({
  xPos,
  targetYAnchor = 4,
  dropDelay = 0,
  texture,
  isMobile,
  scale = 2.2,
  isHorizontal = false,
}: {
  xPos: number;
  targetYAnchor?: number;
  dropDelay?: number;
  texture: THREE.Texture;
  isMobile: boolean;
  scale?: number;
  isHorizontal?: boolean;
}) {
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
  const { width, height } = useThree((state) => state.size);

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
  const [isDropped, setIsDropped] = useState(dropDelay === 0);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, isHorizontal ? 0.6 : 1.45, 0]]);

  useEffect(() => {
    if (dropDelay > 0) {
      const timer = setTimeout(() => {
        setIsDropped(true);
      }, dropDelay);
      return () => clearTimeout(timer);
    }
  }, [dropDelay]);

  useEffect(() => {
    if (hovered && !isMobile) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged, isMobile]);

  useFrame((state, delta) => {
    if (fixed.current) {
      const currentPos = fixed.current.translation();
      const targetY = isDropped ? targetYAnchor : 12;
      const currentY = THREE.MathUtils.lerp(currentPos.y, targetY, isDropped ? 0.08 : 1);
      fixed.current.setNextKinematicTranslation({ x: xPos, y: currentY, z: 0 });
    }

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

  const initialY = dropDelay === 0 ? targetYAnchor : 12;

  return (
    <>
      <group position={[xPos, initialY, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="kinematicPosition" position={[xPos, initialY, 0]} />
        <RigidBody position={[xPos + 0.5, initialY, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[xPos + 1.0, initialY, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[xPos + 1.5, initialY, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[xPos, initialY - 1.5, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={isHorizontal ? [1.1, 0.625, 0.02] : [0.8, 1.125, 0.01]} />
          <group
            scale={scale}
            position={[0, isHorizontal ? -0.6 : -1.2, -0.05]}
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
            {isHorizontal ? (
              // Sleek, Compact Landscape 3D Card (2.2 x 1.25)
              <mesh>
                <boxGeometry args={[2.2, 1.25, 0.04]} />
                <meshPhysicalMaterial
                  map={texture}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.25}
                  metalness={0.1}
                />
              </mesh>
            ) : (
              // Prominent Vertical Photo ID Centerpiece Card
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  {...materials.base}
                  map={texture}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.3}
                  metalness={0.1}
                />
              </mesh>
            )}
            <mesh geometry={nodes.clip.geometry} material={materials.metal} position={[0, isHorizontal ? 0.2 : 0, 0]} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} position={[0, isHorizontal ? 0.2 : 0, 0]} />
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

// ─── Scene Container for all 3 Physics Cards ──────────────────────────────────
function SceneContents({ isMobile }: { isMobile: boolean }) {
  const photoTexture = useTexture('/assets/profile_photo.png');

  const leftHorizontalTexture = useMemo(() => createHorizontalCardTexture('left'), []);
  const rightHorizontalTexture = useMemo(() => createHorizontalCardTexture('right'), []);

  useEffect(() => {
    if (photoTexture) {
      photoTexture.rotation = Math.PI;
      photoTexture.center.set(0.5, 0.5);
      photoTexture.offset.set(-0.2, 0);
      photoTexture.needsUpdate = true;
    }
  }, [photoTexture]);

  // Center photo card is HUGE centerpiece (2.65), side cards are sleek compact landscape (0.88)
  const centerScale = isMobile ? 1.6 : 2.65;
  const sideHorizontalScale = isMobile ? 0.6 : 0.88;
  const xDistance = isMobile ? 1.8 : 3.65;

  const centerYAnchor = isMobile ? 3.6 : 3.35;
  const sideYAnchor = isMobile ? 4.3 : 4.35;

  return (
    <>
      <ambientLight intensity={0.6} />
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>

      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        {/* 1. Center Photo ID Card (HUGE centerpiece attraction, drops at t=0) */}
        <SinglePhysicsCard
          xPos={0}
          targetYAnchor={centerYAnchor}
          dropDelay={0}
          texture={photoTexture}
          isMobile={isMobile}
          scale={centerScale}
          isHorizontal={false}
        />

        {/* 2. Left Card (Compact Sleek Landscape Specs Card) */}
        <SinglePhysicsCard
          xPos={-xDistance}
          targetYAnchor={sideYAnchor}
          dropDelay={750}
          texture={leftHorizontalTexture}
          isMobile={isMobile}
          scale={sideHorizontalScale}
          isHorizontal={true}
        />

        {/* 3. Right Card (Compact Sleek Landscape Roles & Skills Card) */}
        <SinglePhysicsCard
          xPos={xDistance}
          targetYAnchor={sideYAnchor}
          dropDelay={1500}
          texture={rightHorizontalTexture}
          isMobile={isMobile}
          scale={sideHorizontalScale}
          isHorizontal={true}
        />
      </Physics>
    </>
  );
}

// ─── Root Exported Component ──────────────────────────────────────────────────
export function AnimatedIDCardPresentation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      id="home"
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Canvas
        gl={{ alpha: true }}
        camera={{ position: [0, 0, isMobile ? 15 : 13], fov: isMobile ? 32 : 25 }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          pointerEvents: isMobile ? 'none' : 'auto',
        }}
      >
        <SceneContents isMobile={isMobile} />
      </Canvas>
    </section>
  );
}
