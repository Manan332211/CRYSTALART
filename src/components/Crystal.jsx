import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// We create a separate component for the inner image to handle the texture safely
function InnerImage({ url }) {
    // If no URL is provided, we return null before calling useTexture
    if (!url) return null;
    return <ImagePlane url={url} />;
}

function ImagePlane({ url }) {
    // This hook now only runs if the component is rendered (url exists)
    const texture = useTexture(url);

    return (
        <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.1, 1.1]} />
            <meshBasicMaterial
                map={texture}
                transparent={true}
                side={THREE.DoubleSide}
                opacity={0.9}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function Crystal({ shape = 'box', imageUrl }) {
    const meshRef = useRef()

    // 1. Always call Hooks at the top level in the same order
    const heartShape = useMemo(() => {
        const s = new THREE.Shape()
        s.moveTo(0, 0.5)
        s.bezierCurveTo(0, 0.5, -0.5, 1, -1, 0.5)
        s.bezierCurveTo(-1.5, 0, -1, -0.7, 0, -1.2)
        s.bezierCurveTo(1, -0.7, 1.5, 0, 1, 0.5)
        s.bezierCurveTo(0.5, 1, 0, 0.5, 0, 0.5)
        return s
    }, [])

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3
        }
    })

    return (
        <group ref={meshRef}>
            {/* THE GLASS CONTAINER */}
            <mesh castShadow>
                {shape === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
                {shape === 'heart' && <extrudeGeometry args={[heartShape, { depth: 0.4, bevelEnabled: true }]} />}
                {shape === 'round' && <sphereGeometry args={[1, 64, 64]} />}

                <MeshTransmissionMaterial
                    backside
                    samples={16}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    distortion={0.1}
                    transmission={1}
                />
            </mesh>

            {/* THE INNER IMAGE (Safely handled) */}
            <InnerImage url={imageUrl} />
        </group>
    )
}