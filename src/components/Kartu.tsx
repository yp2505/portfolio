import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
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
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.card.geometry} material={materials.base} position={[-0.174, -0.031, 0.437]} />
      <mesh geometry={nodes.clip.geometry} material={materials.metal} position={[-0.174, -0.031, 0.437]} />
      <mesh geometry={nodes.clamp.geometry} material={materials.metal} position={[-0.174, -0.031, 0.437]} />
    </group>
  )
}

useGLTF.preload('/assets/kartu.glb')
