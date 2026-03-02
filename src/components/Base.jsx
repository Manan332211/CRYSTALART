import React from 'react'

export default function Base() {
    return (
        <group position={[0, -1.2, 0]}>
            {/* The main stand body */}
            <mesh castShadow>
                <boxGeometry args={[2, 0.4, 2]} />
                {/* Using a dark wood/matte plastic material */}
                <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.2} />
            </mesh>

            {/* The internal LED Glow (This light hits the bottom of your crystal) */}
            <pointLight position={[0, 0.5, 0]} intensity={5} color="#00ffff" distance={3} />

            {/* The glowing "glass" strip on top of the base */}
            <mesh position={[0, 0.21, 0]}>
                <boxGeometry args={[1.5, 0.05, 1.5]} />
                <meshStandardMaterial emissive="#00ffff" emissiveIntensity={4} toneMapped={false} />
            </mesh>
        </group>
    )
}