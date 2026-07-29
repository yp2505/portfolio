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

// ─── Helper: Generate Crisp, Forward-Reading Textures for 3D Cards ─────────────
function createCardTexture(type: 'left' | 'right'): THREE.CanvasTexture {
  if (typeof window === 'undefined') return new THREE.CanvasTexture(null as any);

  const canvas = window.document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Flip X coordinate space so 180-degree GLTF mesh rotation yields right-side-up, forward-reading text
  ctx.save();
  ctx.translate(1024, 0);
  ctx.scale(-1, 1);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1440);
  bgGrad.addColorStop(0, '#091526');
  bgGrad.addColorStop(1, '#040812');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1440);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.06)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
  for (let y = 0; y < 1440; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Outer border & glow frame
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
  ctx.lineWidth = 16;
  ctx.strokeRect(32, 32, 960, 1376);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 56, 912, 1328);

  const leftMargin = 90;

  if (type === 'left') {
    // ── LEFT CARD: GENERAL SPECS ──
    // Pill Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 110, 470, 68, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(leftMargin + 36, 144, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 26px "Inter", sans-serif';
    ctx.fillText('OPEN TO OPPORTUNITIES', leftMargin + 62, 153);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 58px "Inter", sans-serif';
    ctx.fillText('Building Scalable', leftMargin, 290);

    const grad = ctx.createLinearGradient(leftMargin, 0, 750, 0);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.font = '800 62px "Inter", sans-serif';
    ctx.fillText('Data & ML Systems', leftMargin, 370);

    // Description text (comfortably wrapped)
    ctx.fillStyle = 'rgba(232, 244, 255, 0.82)';
    ctx.font = '400 32px "Inter", sans-serif';
    ctx.fillText('Transforming complex datasets', leftMargin, 520);
    ctx.fillText('into high-impact machine', leftMargin, 575);
    ctx.fillText('learning models and robust', leftMargin, 630);
    ctx.fillText('data engineering pipelines.', leftMargin, 685);

    // Highlight Quote
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.font = 'italic 30px "Inter", sans-serif';
    ctx.fillText('"Data is the new oil — I help refine it."', leftMargin, 840);

  } else {
    // ── RIGHT CARD: ROLES & TECH STACK ──
    // Pill Badge
    ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
    ctx.beginPath();
    ctx.roundRect(leftMargin, 110, 360, 68, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 26px "Inter", sans-serif';
    ctx.fillText('PRIMARY ROLES', leftMargin + 40, 153);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 58px "Inter", sans-serif';
    ctx.fillText('ML Engineer &', leftMargin, 290);

    const grad = ctx.createLinearGradient(leftMargin, 0, 750, 0);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.font = '800 62px "Inter", sans-serif';
    ctx.fillText('Data Engineer', leftMargin, 370);

    // Skills Badges Layout
    const skills = ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'SQL', 'scikit-learn'];
    let startX = leftMargin;
    let startY = 520;
    skills.forEach((skill) => {
      ctx.font = '600 28px "Inter", sans-serif';
      const textWidth = ctx.measureText(skill).width;
      const boxWidth = textWidth + 44;
      if (startX + boxWidth > 930) {
        startX = leftMargin;
        startY += 86;
      }
      ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
      ctx.beginPath();
      ctx.roundRect(startX, startY, boxWidth, 62, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillText(skill, startX + 22, startY + 42);
      startX += boxWidth + 18;
    });

    ctx.fillStyle = 'rgba(232, 244, 255, 0.7)';
    ctx.font = '400 30px "Inter", sans-serif';
    ctx.fillText('End-to-end ML models & ETL pipelines.', leftMargin, 840);
  }

  // Card Branding footer
  ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillText('yug.dev', leftMargin, 1320);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.rotation = Math.PI;
  texture.center.set(0.5, 0.5);
  texture.needsUpdate = true;
  return texture;
}

// ─── Single Physics 3D ID Card Component ──────────────────────────────────────
function SinglePhysicsCard({
  xPos,
  yAnchor = 4,
  texture,
  isMobile,
  scale = 2.2,
}: {
  xPos: number;
  yAnchor?: number;
  texture: THREE.Texture;
  isMobile: boolean;
  scale?: number;
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

  return (
    <>
      <group position={[xPos, yAnchor, 0]}>
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
            scale={scale}
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
                map={texture}
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

// ─── Scene Container for all 3 Physics Cards ──────────────────────────────────
function SceneContents({ isMobile }: { isMobile: boolean }) {
  const photoTexture = useTexture('/assets/profile_photo.png');

  const leftTexture = useMemo(() => createCardTexture('left'), []);
  const rightTexture = useMemo(() => createCardTexture('right'), []);

  useEffect(() => {
    if (photoTexture) {
      photoTexture.rotation = Math.PI;
      photoTexture.center.set(0.5, 0.5);
      photoTexture.offset.set(-0.2, 0);
      photoTexture.needsUpdate = true;
    }
  }, [photoTexture]);

  // Sequential drop timing: Center photo card drops first -> Left -> Right
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLeft(true), 400);
    const t2 = setTimeout(() => setShowRight(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Center photo card is larger (2.3) and sits lower (3.6), side cards hang higher (4.3) and smaller (1.9)
  const centerScale = isMobile ? 1.5 : 2.35;
  const sideScale = isMobile ? 1.25 : 1.9;
  const xDistance = isMobile ? 1.75 : 3.4;

  const centerYAnchor = isMobile ? 3.8 : 3.6;
  const sideYAnchor = isMobile ? 4.3 : 4.4;

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
        {/* 1. Center Photo ID Card (Main centerpiece attraction) */}
        <SinglePhysicsCard
          xPos={0}
          yAnchor={centerYAnchor}
          texture={photoTexture}
          isMobile={isMobile}
          scale={centerScale}
        />

        {/* 2. Left Card (General Specs) - hangs slightly higher */}
        {showLeft && (
          <SinglePhysicsCard
            xPos={-xDistance}
            yAnchor={sideYAnchor}
            texture={leftTexture}
            isMobile={isMobile}
            scale={sideScale}
          />
        )}

        {/* 3. Right Card (Primary Roles) - hangs slightly higher */}
        {showRight && (
          <SinglePhysicsCard
            xPos={xDistance}
            yAnchor={sideYAnchor}
            texture={rightTexture}
            isMobile={isMobile}
            scale={sideScale}
          />
        )}
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
