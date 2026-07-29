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

// ─── Helper: Generate Crisp Textures for Horizontal Landscape 3D Cards ─────────
function createHorizontalCardTexture(type: 'left' | 'right'): THREE.CanvasTexture {
  if (typeof window === 'undefined') return new THREE.CanvasTexture(null as any);

  const canvas = window.document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(null as any);

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
  bgGrad.addColorStop(0, '#0a182e');
  bgGrad.addColorStop(0.5, '#050d1a');
  bgGrad.addColorStop(1, '#02050d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1000);

  // Grid pattern
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.06)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1600; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1000);
    ctx.stroke();
  }
  for (let y = 0; y < 1000; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // Outer border & glow frame
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.55)';
  ctx.lineWidth = 16;
  ctx.strokeRect(28, 28, 1544, 944);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, 1504, 904);

  const leftMargin = 80;

  if (type === 'left') {
    // ── LEFT HORIZONTAL CARD: GENERAL SPECS ──
    // Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 80, 440, 64, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(leftMargin + 32, 112, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillText('OPEN TO OPPORTUNITIES', leftMargin + 54, 120);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 58px "Inter", sans-serif';
    ctx.fillText('Building Scalable Data & ML Systems', leftMargin, 230);

    // Glowing Divider Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 280);
    ctx.lineTo(1520, 280);
    ctx.stroke();

    // Description text
    ctx.fillStyle = 'rgba(232, 244, 255, 0.88)';
    ctx.font = '400 36px "Inter", sans-serif';
    ctx.fillText('Transforming complex datasets into high-impact machine learning models', leftMargin, 380);
    ctx.fillText('and robust, production-ready data engineering pipelines.', leftMargin, 445);

    // Highlight Quote
    ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.font = 'italic 34px "Inter", sans-serif';
    ctx.fillText('"Turning raw data into scalable intelligence."', leftMargin, 580);

  } else {
    // ── RIGHT HORIZONTAL CARD: ROLES & TECH STACK ──
    // Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 80, 320, 64, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillText('PRIMARY ROLES', leftMargin + 40, 120);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 58px "Inter", sans-serif';
    ctx.fillText('ML Engineer & Data Engineer', leftMargin, 230);

    // Glowing Divider Line
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 280);
    ctx.lineTo(1520, 280);
    ctx.stroke();

    // Skills Badges (Single horizontal line)
    const skills = ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'SQL', 'scikit-learn'];
    let startX = leftMargin;
    const y = 370;

    skills.forEach((skill) => {
      ctx.font = '600 28px "Inter", sans-serif';
      const tw = ctx.measureText(skill).width;
      const bw = tw + 44;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
      ctx.beginPath();
      ctx.roundRect(startX, y, bw, 66, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(skill, startX + 22, y + 44);
      startX += bw + 18;
    });

    ctx.fillStyle = 'rgba(232, 244, 255, 0.82)';
    ctx.font = '400 34px "Inter", sans-serif';
    ctx.fillText('End-to-End Model Development & Distributed Data Engineering Pipelines.', leftMargin, 580);
  }

  // Card Branding footer
  ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillText('yug.dev', leftMargin, 900);

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
  useSphericalJoint(j3, card, [[0, 0, 0], [0, isHorizontal ? 0.9 : 1.45, 0]]);

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
          <CuboidCollider args={isHorizontal ? [1.6, 1.0, 0.02] : [0.8, 1.125, 0.01]} />
          <group
            scale={scale}
            position={[0, isHorizontal ? -0.8 : -1.2, -0.05]}
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
              // Custom Horizontal Rectangle 3D Card
              <mesh>
                <boxGeometry args={[3.2, 2.0, 0.04]} />
                <meshPhysicalMaterial
                  map={texture}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.25}
                  metalness={0.1}
                />
              </mesh>
            ) : (
              // Vertical Photo ID Card
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
            <mesh geometry={nodes.clip.geometry} material={materials.metal} position={[0, isHorizontal ? 0.35 : 0, 0]} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} position={[0, isHorizontal ? 0.35 : 0, 0]} />
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

  // Center photo card is vertical (2.45), side cards are horizontal landscape rectangles (1.15)
  const centerScale = isMobile ? 1.5 : 2.45;
  const sideHorizontalScale = isMobile ? 0.8 : 1.15;
  const xDistance = isMobile ? 1.9 : 4.1;

  const centerYAnchor = isMobile ? 3.8 : 3.6;
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
        {/* 1. Center Photo ID Card (Vertical ID Card centerpiece) */}
        <SinglePhysicsCard
          xPos={0}
          targetYAnchor={centerYAnchor}
          dropDelay={0}
          texture={photoTexture}
          isMobile={isMobile}
          scale={centerScale}
          isHorizontal={false}
        />

        {/* 2. Left Card (Horizontal Landscape Specs Card) */}
        <SinglePhysicsCard
          xPos={-xDistance}
          targetYAnchor={sideYAnchor}
          dropDelay={750}
          texture={leftHorizontalTexture}
          isMobile={isMobile}
          scale={sideHorizontalScale}
          isHorizontal={true}
        />

        {/* 3. Right Card (Horizontal Landscape Roles & Skills Card) */}
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
