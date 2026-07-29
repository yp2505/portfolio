import * as THREE from 'three'
import React, { useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    card: THREE.Mesh
    clip: THREE.Mesh
    clamp: THREE.Mesh
  }
  materials: {
    base: THREE.MeshStandardMaterial
    metal: THREE.MeshStandardMaterial
  }
}

export function Model(props: any) {
  const { nodes, materials } = useGLTF('/assets/kartu.glb') as unknown as GLTFResult
  const cardTexture = useTexture('/assets/profile_photo.png')

  useEffect(() => {
    if (cardTexture) {
      cardTexture.rotation = Math.PI;
      cardTexture.center.set(0.5, 0.5);
      cardTexture.offset.set(-0.2, 0);
      cardTexture.needsUpdate = true;
    }
  }, [cardTexture]);

  return (
    <group {...props} dispose={null}>
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
      <mesh geometry={nodes.clip.geometry} material={materials.metal} position={[-0.174, -0.031, 0.437]} />
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} position={[-0.174, -0.031, 0.437]} />
    </group>
  )
}

useGLTF.preload('/assets/kartu.glb')
useTexture.preload('/assets/profile_photo.png')
