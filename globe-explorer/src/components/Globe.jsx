import { useRef, useState, useEffect } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.05, 64, 64]} />
      <meshStandardMaterial
        color="#4a9eff"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function Pin({ lat, lng }) {
  const R = 2.05
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(R * Math.sin(phi) * Math.cos(theta))
  const z = R * Math.sin(phi) * Math.sin(theta)
  const y = R * Math.cos(phi)

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={0.8} />
    </mesh>
  )
}

function GlobeMesh({ onCoordClick }) {
  const meshRef = useRef()
  const texture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-day.jpg'
  )

  const handleClick = (e) => {
    e.stopPropagation()
    const point = e.point.clone().normalize()
    const lat = Math.asin(point.y) * (180 / Math.PI)
    const lng = Math.atan2(-point.z, point.x) * (180 / Math.PI)
    onCoordClick(lat, lng)
  }

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  )
}

export default function Globe({ onCoordClick, selectedCountry }) {
  const pinCoords = selectedCountry?.latlng

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} />
      <GlobeMesh onCoordClick={onCoordClick} />
      <Atmosphere />
      {pinCoords && <Pin lat={pinCoords[0]} lng={pinCoords[1]} />}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.4}
        minDistance={3}
        maxDistance={8}
      />
    </Canvas>
  )
}