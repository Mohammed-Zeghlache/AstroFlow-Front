import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sparkles, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Hands } from '@mediapipe/hands';
import './Home.css';

const COUNT = 20000;

const generateShape = (shape) => {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    let x, y, z;
    
    if (shape === 'SATURN') {
      if (i < COUNT * 0.6) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        x = 2.5 * Math.sin(phi) * Math.cos(theta);
        y = 2.5 * Math.sin(phi) * Math.sin(theta);
        z = 2.5 * Math.cos(phi);
      } else {
        const angle = Math.random() * Math.PI * 2;
        const r = 3.5 + Math.random() * 1.5;
        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r * 0.2;
        z = Math.sin(angle) * r;
      }
    } else if (shape === 'HEART') {
      const t = Math.random() * Math.PI * 2;
      x = 0.2 * (16 * Math.pow(Math.sin(t), 3));
      y = 0.2 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      z = (Math.random() - 0.5) * 1.5;
    } else if (shape === 'SPHERE') {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      x = 3.5 * Math.sin(phi) * Math.cos(theta);
      y = 3.5 * Math.sin(phi) * Math.sin(theta);
      z = 3.5 * Math.cos(phi);
    } else if (shape === 'STAR') {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 3.0 + Math.sin(theta * 5) * 0.8;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    } else if (shape === 'GALAXY') {
      const radius = Math.pow(Math.random(), 1.3) * 7;
      const angle = Math.random() * Math.PI * 2;
      const arm = (Math.random() - 0.5) * 2;
      x = Math.cos(angle + radius * 0.3) * radius;
      y = (Math.random() - 0.5) * 1.2;
      z = Math.sin(angle + radius * 0.3) * radius + arm;
    } else if (shape === 'RING') {
      const angle = Math.random() * Math.PI * 2;
      const r = 4.0;
      x = Math.cos(angle) * r;
      y = Math.sin(angle) * r * 0.1;
      z = Math.sin(angle) * r;
    } else if (shape === 'CRYSTAL') {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 2.8 + Math.sin(theta * 6) * 0.7;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    } else if (shape === 'BUTTERFLY') {
      const t = Math.random() * Math.PI * 2;
      const scale = 0.35;
      x = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t/12), 5)) * scale;
      y = Math.cos(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t/12), 5)) * scale;
      z = (Math.random() - 0.5) * 2;
    } else if (shape === 'PYRAMID') {
      const side = Math.floor(Math.random() * 4);
      const h = Math.random() * 3;
      if (side === 0) { x = h; y = 3 - h; z = h; }
      else if (side === 1) { x = -h; y = 3 - h; z = h; }
      else if (side === 2) { x = h; y = 3 - h; z = -h; }
      else { x = -h; y = 3 - h; z = -h; }
    } else if (shape === 'ATOM') {
      const ring = Math.floor(Math.random() * 3);
      const angle = Math.random() * Math.PI * 2;
      if (ring === 0) {
        x = Math.cos(angle) * 3;
        y = Math.sin(angle) * 3;
        z = (Math.random() - 0.5) * 0.5;
      } else if (ring === 1) {
        x = Math.cos(angle) * 3;
        z = Math.sin(angle) * 3;
        y = (Math.random() - 0.5) * 0.5;
      } else {
        y = Math.cos(angle) * 3;
        z = Math.sin(angle) * 3;
        x = (Math.random() - 0.5) * 0.5;
      }
    }
    // NEW SHAPES - ADDED WITHOUT CHANGING ANY EXISTING CODE
    else if (shape === 'TORUS') {
      const R = 3.2;
      const r = 1.2;
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      x = (R + r * Math.cos(v)) * Math.cos(u);
      y = (R + r * Math.cos(v)) * Math.sin(u);
      z = r * Math.sin(v);
    }
    else if (shape === 'DNA') {
      const t = Math.random() * Math.PI * 4;
      const side = Math.random() > 0.5 ? 1 : -1;
      x = Math.cos(t) * 2.5;
      y = t * 0.7 - 4;
      z = Math.sin(t) * 2.5 + side * 0.8;
    }
    else if (shape === 'CUBE') {
      const face = Math.floor(Math.random() * 6);
      const s = 2.5;
      const u = (Math.random() - 0.5) * 2;
      const v = (Math.random() - 0.5) * 2;
      if (face === 0) { x = s; y = u * s; z = v * s; }
      else if (face === 1) { x = -s; y = u * s; z = v * s; }
      else if (face === 2) { x = u * s; y = s; z = v * s; }
      else if (face === 3) { x = u * s; y = -s; z = v * s; }
      else if (face === 4) { x = u * s; y = v * s; z = s; }
      else { x = u * s; y = v * s; z = -s; }
    }
    else if (shape === 'ICOSPHERE') {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 3.0 + Math.sin(phi * 8) * 0.5;
      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    }
    else if (shape === 'TRIANGLE') {
      const angle = Math.random() * Math.PI * 2;
      const r = 3.2 * (1 + Math.random() * 0.3);
      x = r * Math.cos(angle);
      y = r * Math.sin(angle);
      z = (Math.random() - 0.5) * 0.5;
    }
    else if (shape === 'SPIRAL') {
      const t = Math.random() * Math.PI * 4;
      const r = t * 0.6;
      x = Math.cos(t) * r;
      y = Math.sin(t) * r;
      z = (Math.random() - 0.5) * 1.5;
    }
    else if (shape === 'FLOWER') {
      const t = Math.random() * Math.PI * 2;
      const r = 3.0 + Math.sin(t * 6) * 1.2;
      x = r * Math.cos(t);
      y = r * Math.sin(t) * 0.5;
      z = (Math.random() - 0.5) * 1.5;
    }
    pos[i3] = x; pos[i3+1] = y; pos[i3+2] = z;
  }
  return pos;
};

function CameraController({ targetZoom }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z += (targetZoom - camera.position.z) * 0.1;
  });
  return null;
}

function Particles({ handPos, shape, rotationAngle, isPlaying, particleColor, effectIntensity }) {
  const ref = useRef();
  const targetData = useMemo(() => generateShape(shape), [shape]);
  const initialPos = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = targetData[i3];
      pos[i3 + 1] = targetData[i3 + 1];
      pos[i3 + 2] = targetData[i3 + 2];
    }
    return pos;
  }, [targetData]);

  useFrame((state) => {
    if (!ref.current) return;
    const geo = ref.current.geometry.attributes.position;
    const material = ref.current.material;
    const time = state.clock.elapsedTime;

    if (isPlaying) {
      const pulse = Math.sin(time * 2.2) * 0.2 + 0.9;
      material.size = 0.06 * pulse;
      material.color.set(particleColor);
      material.opacity = 0.8 + Math.sin(time * 3) * 0.2;
    }

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      let tx = targetData[i3];
      let ty = targetData[i3 + 1];
      let tz = targetData[i3 + 2];

      if (rotationAngle !== 0) {
        const cos = Math.cos(rotationAngle);
        const sin = Math.sin(rotationAngle);
        const newX = tx * cos - tz * sin;
        const newZ = tx * sin + tz * cos;
        tx = newX;
        tz = newZ;
      }

      if (handPos && handPos.x !== undefined && handPos.y !== undefined) {
        const hx = (handPos.x - 0.5) * 15;
        const hy = (0.5 - handPos.y) * 15;
        const hz = Math.sin(time) * 2;
        
        const dx = hx - geo.array[i3];
        const dy = hy - geo.array[i3 + 1];
        const dz = hz - geo.array[i3 + 2];
        const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        const interactionRadius = 5.0;
        
        if (distance3D < interactionRadius) {
          const force = (interactionRadius - distance3D) / interactionRadius;
          const pushStrength = force * effectIntensity;
          
          const normalizedDx = distance3D > 0 ? dx / distance3D : 0;
          const normalizedDy = distance3D > 0 ? dy / distance3D : 0;
          const normalizedDz = distance3D > 0 ? dz / distance3D : 0;
          
          tx += normalizedDx * pushStrength;
          ty += normalizedDy * pushStrength;
          tz += normalizedDz * pushStrength + Math.sin(time * 4 + i * 0.05) * 0.4;
        }
      }

      geo.array[i3] += (tx - geo.array[i3]) * 0.08;
      geo.array[i3 + 1] += (ty - geo.array[i3 + 1]) * 0.08;
      geo.array[i3 + 2] += (tz - geo.array[i3 + 2]) * 0.08;
    }
    geo.needsUpdate = true;
    ref.current.rotation.y += 0.0003;
    ref.current.rotation.x += 0.0001;
  });

  return (
    <Points ref={ref} positions={initialPos} stride={3}>
      <PointMaterial 
        transparent 
        color={particleColor} 
        size={0.06} 
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </Points>
  );
}

export default function App() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [handPos, setHandPos] = useState(null);
  const [shape, setShape] = useState('SATURN');
  const [zoom, setZoom] = useState(15);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [cameraStatus, setCameraStatus] = useState('Initializing...');
  const [handDetected, setHandDetected] = useState(false);
  const [showDebugVideo, setShowDebugVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Auto-play on mobile
  const [particleColor, setParticleColor] = useState('#ffdf7e');
  const [effectIntensity, setEffectIntensity] = useState(1.2);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const previousPinchDistance = useRef(null);
  const previousHandX = useRef(null);

  // ============ MOBILE-FRIENDLY AUDIO ============
  useEffect(() => {
    const audioSources = [
      'https://actions.google.com/sounds/v1/ambiences/soft_piano.ogg',
      'https://actions.google.com/sounds/v1/ambiences/wind_chimes.ogg',
      'https://actions.google.com/sounds/v1/ambiences/river.ogg'
    ];
    
    let currentAudioIndex = 0;
    
    const loadAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(audioSources[currentAudioIndex]);
      audio.loop = true;
      audio.volume = 0.2;
      
      // Mobile-friendly: Try to play automatically
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log('✅ Audio playing on mobile');
          })
          .catch(error => {
            console.log('⚠️ Auto-play prevented by browser, waiting for user interaction');
            // On mobile, we need a user gesture
            const handleFirstInteraction = () => {
              audio.play()
                .then(() => {
                  setIsPlaying(true);
                  document.removeEventListener('touchstart', handleFirstInteraction);
                  document.removeEventListener('click', handleFirstInteraction);
                })
                .catch(e => console.log('Still failed:', e));
            };
            document.addEventListener('touchstart', handleFirstInteraction);
            document.addEventListener('click', handleFirstInteraction);
          });
      }
      
      audio.addEventListener('canplaythrough', () => {
        setMusicLoaded(true);
      });
      
      audio.addEventListener('error', () => {
        currentAudioIndex++;
        if (currentAudioIndex < audioSources.length) {
          loadAudio();
        }
      });
      
      audioRef.current = audio;
    };
    
    loadAudio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ============ HAND TRACKING ============
  useEffect(() => {
    if (typeof window.Camera === 'undefined') {
      setCameraStatus('Loading MediaPipe...');
      return;
    }

    let hands;
    let camera;

    const initCamera = async () => {
      try {
        setCameraStatus('📷 Requesting camera...');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        stream.getTracks().forEach(track => track.stop());

        setCameraStatus('⚡ Initializing...');

        hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        
        hands.setOptions({ 
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.2,
          minTrackingConfidence: 0.2
        });
        
        hands.onResults(res => {
          if (res?.multiHandLandmarks?.length > 0) {
            const landmarks = res.multiHandLandmarks[0];
            const indexFinger = landmarks[8];
            
            setHandPos({ x: indexFinger.x, y: indexFinger.y });
            setHandDetected(true);
            setCameraStatus(isPlaying ? '🎵 Hand detected' : '✨ Hand detected');
            
            if (landmarks.length > 4) {
              const thumb = landmarks[4];
              const index = landmarks[8];
              const pinchDistance = Math.hypot(thumb.x - index.x, thumb.y - index.y);
              
              if (previousPinchDistance.current !== null) {
                const delta = previousPinchDistance.current - pinchDistance;
                if (Math.abs(delta) > 0.015) {
                  setZoom(prev => Math.max(5, Math.min(30, prev + delta * 40)));
                  setEffectIntensity(1.2 + Math.abs(delta) * 20);
                }
              }
              previousPinchDistance.current = pinchDistance;
            }
            
            if (previousHandX.current !== null) {
              const deltaX = indexFinger.x - previousHandX.current;
              if (Math.abs(deltaX) > 0.005) {
                setRotationAngle(prev => prev + deltaX * 2);
              }
            }
            previousHandX.current = indexFinger.x;
            
            // HAND COLOR CONTROL - 4 COLORS
            const handY = indexFinger.y;
            if (handY < 0.25) {
              setParticleColor('#ff9f4b'); // orange
            } else if (handY < 0.5) {
              setParticleColor('#ffdf7e'); // gold
            } else if (handY < 0.75) {
              setParticleColor('#6b9fff'); // blue
            } else {
              setParticleColor('#ff7eb3'); // pink
            }
            
          } else {
            setHandPos(null);
            setHandDetected(false);
            setCameraStatus(isPlaying ? '🎵 Show your hand' : '👋 Show your hand');
            previousPinchDistance.current = null;
            previousHandX.current = null;
          }
        });

        if (videoRef.current) {
          camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current?.readyState === 4) {
                await hands.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });
          
          camera.start();
          setCameraStatus(isPlaying ? '🎵 Move hand to interact' : '👆 Move hand to interact');
        }
      } catch (err) {
        setCameraStatus('❌ Camera error');
      }
    };

    initCamera();

    return () => {
      if (camera) camera.stop();
    };
  }, [isPlaying]);

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(5, Math.min(30, prev + (e.deltaY > 0 ? 1 : -1))));
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const allShapes = ['SATURN', 'HEART', 'SPHERE', 'STAR', 'GALAXY', 'RING', 'CRYSTAL', 'BUTTERFLY', 'PYRAMID', 'ATOM', 'TORUS', 'DNA', 'CUBE', 'ICOSPHERE', 'TRIANGLE', 'SPIRAL', 'FLOWER'];

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'radial-gradient(circle at 50% 50%, #0a0a20, #000)',
        overflow: 'hidden',
        position: 'relative'
      }}
      onWheel={handleWheel}
    >
      {/* BACKGROUND STARS - ALWAYS VISIBLE */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 30%, rgba(255,200,100,0.1) 0%, transparent 30%), radial-gradient(circle at 80% 70%, rgba(100,200,255,0.1) 0%, transparent 30%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* DEBUG VIDEO - CONTROLLED BY BUTTON */}
      <video 
        ref={videoRef} 
        className="debug-video"
        style={{ 
          display: showDebugVideo ? 'block' : 'none',
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '200px',
          height: '150px',
          border: '2px solid #ffdf7e',
          borderRadius: '10px',
          zIndex: 1000,
          transform: 'scaleX(-1)',
          boxShadow: '0 0 20px rgba(255,223,126,0.3)'
        }}
        autoPlay
        playsInline
        muted
      />
      
      {/* ============ CONTROLS - HIDE WHEN showControls = FALSE ============ */}
      
      {/* SHAPE BUTTONS - NOW WITH 17 SHAPES */}

      {showControls && (
        <div className="controls-container" style={{ 
          position: 'absolute', 
          bottom: '60px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 100, 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          background: 'rgba(10,10,20,0.7)',
          backdropFilter: 'blur(12px)',
          padding: '18px 25px',
          borderRadius: '50px',
          border: '1px solid rgba(255,223,126,0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxWidth: '95%'
        }}>
          {allShapes.map(s => (
            <button 
              key={s} 
              onClick={() => setShape(s)} 
              className="shape-button" 
              style={{
                background: shape === s ? particleColor : 'rgba(255,255,255,0.08)',
                color: shape === s ? '#000' : '#fff',
                border: shape === s ? `2px solid ${particleColor}` : '2px solid rgba(255,255,255,0.15)',
                padding: '8px 18px',
                borderRadius: '40px',
                cursor: 'pointer',
                fontWeight: shape === s ? 'bold' : 'normal',
                fontSize: '13px',
                transition: 'all 0.2s',
                textShadow: shape === s ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                boxShadow: shape === s ? `0 0 18px ${particleColor}` : 'none'
              }}
            >{s}</button>
          ))}
        </div>
      )}



      {/* MUSIC BUTTON - REMOVED COMPLETELY */}

      {/* UI TOGGLE BUTTON - ALWAYS VISIBLE */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <button 
          onClick={toggleControls}
          style={{ 
            background: showControls ? 'rgba(255,223,126,0.18)' : 'rgba(20,20,30,0.7)', 
            border: showControls ? '2px solid #ffdf7e' : '2px solid rgba(255,255,255,0.2)', 
            color: '#fff', 
            padding: '10px 20px', 
            borderRadius: '40px', 
            cursor: 'pointer', 
            fontSize: '14px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: showControls ? '0 0 15px rgba(255,223,126,0.2)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <span>{showControls ? '👁️' : '👁️‍🗨️'}</span>
          <span>{showControls ? 'Hide UI' : 'Show UI'}</span>
        </button>
      </div>


      {/* 3D CANVAS - ALWAYS VISIBLE */}
      <Canvas camera={{ position: [0, 0, zoom], fov: 50 }}>
        <CameraController targetZoom={zoom} />
        <Particles 
          handPos={handPos} 
          shape={shape} 
          rotationAngle={rotationAngle} 
          isPlaying={isPlaying}
          particleColor={particleColor}
          effectIntensity={effectIntensity}
        />
        <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
      </Canvas>
      
      {/* HAND CURSOR - ALWAYS VISIBLE (never hides) */}
      {handPos && handPos.x !== undefined && (
        <div style={{
          position: 'absolute',
          left: `${handPos.x * 100}%`,
          top: `${handPos.y * 100}%`,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${particleColor}40 0%, transparent 75%)`,
          border: `2px solid ${particleColor}`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 1000,
          boxShadow: `0 0 25px ${particleColor}`,
          animation: 'cursorGlow 2s infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            background: particleColor,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 15px ${particleColor}`
          }} />
        </div>
      )}
      
      {/* STATUS PANEL - HIDE WHEN showControls = FALSE */}
      {showControls && handDetected && (
        <div className="status-panel" style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#fff',
          fontSize: '13px',
          fontFamily: 'sans-serif',
          background: 'rgba(10,10,20,0.8)',
          backdropFilter: 'blur(12px)',
          padding: '18px',
          borderRadius: '18px',
          border: `2px solid ${particleColor}40`,
          maxWidth: '300px',
          boxShadow: `0 0 25px ${particleColor}20`,
          transition: 'all 0.2s',
          zIndex: 100
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: particleColor,
              boxShadow: `0 0 15px ${particleColor}`,
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: '15px',
              color: particleColor
            }}>
              HAND ACTIVE
            </span>
          </div>
          
          <div style={{ marginBottom: '12px', fontSize: '13px', opacity: 0.9 }}>
            {cameraStatus}
          </div>
          
          {handPos && (
            <div style={{ 
              marginBottom: '12px', 
              fontSize: '12px',
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#aaa' }}>Color:</span>
                <span style={{ color: particleColor, fontWeight: 'bold' }}>
                  {particleColor === '#ff9f4b' ? 'ORANGE' : 
                   particleColor === '#ffdf7e' ? 'GOLD' : 
                   particleColor === '#6b9fff' ? 'BLUE' : 'PINK'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa' }}>Shape:</span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{shape}</span>
              </div>
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#aaa'
          }}>
            <span>🖐️ Move = Rotate</span>
            <span>🤏 Pinch = Zoom</span>
            <span>👆 Up/Down = Color</span>
          </div>
        </div>
      )}

      {/* FOOTER - HIDE WHEN showControls = FALSE */}
      {showControls && (
        <div className="footer" style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          opacity: 0.8,
          transition: 'opacity 0.2s',
          background: 'rgba(10,10,20,0.6)',
          backdropFilter: 'blur(8px)',
          padding: '10px 25px',
          borderRadius: '50px',
          border: '1px solid rgba(255,223,126,0.2)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
         
        </div>
      )}

      <style>{`
        @keyframes cursorGlow {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          100% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes musicPulse {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes pulse {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}