import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import Crystal from './components/Crystal';
import Base from './components/Base'; // We'll create this next
import { useImageProcessor } from './hooks/useImageProcessor';
import './App.css';

function App() {
  const [shape, setShape] = useState('box');
  const [image, setImage] = useState(null);
  const { processImage, loading } = useImageProcessor();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // PRO STEP: Send to AI for background removal
      const processedUrl = await processImage(file);
      setImage(processedUrl);
    }
  };

  return (
    <div className="app-container">

      {/* 1. THE UI OVERLAY */}
      <div className="ui-panel">
        <h1 className="logo">CRYSTAL<span>ART</span></h1>

        <div className="control-group">
          <label className="upload-label">
            {loading ? "AI Processing..." : "Upload Your Photo"}
            <input type="file" onChange={handleFileChange} hidden accept="image/*" disabled={loading} />
          </label>
        </div>

        <div className="control-group">
          <p>Select Crystal Shape</p>
          <div className="button-grid">
            <button className={shape === 'box' ? 'active' : ''} onClick={() => setShape('box')}>Cube</button>
            <button className={shape === 'heart' ? 'active' : ''} onClick={() => setShape('heart')}>Heart</button>
            <button className={shape === 'round' ? 'active' : ''} onClick={() => setShape('round')}>Sphere</button>
          </div>
        </div>
      </div>

      {/* 2. THE 3D CANVAS */}
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 45 }}>
        {/* Lighting for Realism */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />

        {/* Environment gives the glass its reflections */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Crystal shape={shape} imageUrl={image} />
          </Float>

          <Base /> {/* This is the LED light stand */}
        </Suspense>

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls makeDefault minDistance={3} maxDistance={8} enablePan={false} />
      </Canvas>

      {/* 3. LOADING SPINNER */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>AI is removing background...</p>
        </div>
      )}
    </div>
  );
}

export default App;