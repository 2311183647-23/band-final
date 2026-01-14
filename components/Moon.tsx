
import React, { useRef, Suspense, useEffect, ReactNode } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      main: any;
      section: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      p: any;
      span: any;
      button: any;
      a: any;
      input: any;
      textarea: any;
      form: any;
      br: any;
      svg: any;
      circle: any;
      line: any;
      canvas: any;
      img: any;
      nav: any;
      mesh: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

const MOON_TEXTURE_URL = 'https://deadrabbit.collax.app/moon/lroc_color_poles_2k.jpeg';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children?: ReactNode; 
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: any): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children || null;
  }
}

const TexturedSphere: React.FC = () => {
    const colorMap = useLoader(TextureLoader, MOON_TEXTURE_URL);
    
    useEffect(() => {
        if (colorMap) {
            colorMap.colorSpace = THREE.SRGBColorSpace;
            colorMap.anisotropy = 16;
            colorMap.wrapS = THREE.RepeatWrapping;
            colorMap.needsUpdate = true;
        }
    }, [colorMap]);
    
    return (
        <meshStandardMaterial 
          map={colorMap}
          bumpMap={colorMap}
          bumpScale={0.02}
          roughness={1.0}
          metalness={0.0}
          emissive={"#ffffff"}
          emissiveMap={colorMap}
          emissiveIntensity={0.0005}
        />
    );
};

const FallbackMaterial: React.FC = () => (
    <meshStandardMaterial color="#080808" roughness={1} />
);

const MoonSphere: React.FC<{ phase: number }> = ({ phase }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame(() => {
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.0015;
    }

    if (sunLightRef.current) {
      const angle = (phase * Math.PI * 2) + Math.PI;
      const radius = 30; 
      sunLightRef.current.position.x = radius * Math.sin(angle);
      sunLightRef.current.position.z = radius * Math.cos(angle);
      sunLightRef.current.position.y = 0; 
      sunLightRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.01} />
      <directionalLight ref={sunLightRef} intensity={3.2} color="#ffffff" />
      <pointLight position={[10, 5, 10]} intensity={0.05} color="#D4AF37" />
      
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.41, 128, 128]} /> 
        <ErrorBoundary fallback={<FallbackMaterial />}>
            <Suspense fallback={<FallbackMaterial />}>
                <TexturedSphere />
            </Suspense>
        </ErrorBoundary>
      </mesh>
    </>
  );
};

interface MoonProps {
  phase?: number;
  size?: number;
}

export const Moon: React.FC<MoonProps> = ({ phase = 0.5, size = 300 }) => {
  return (
    <div 
      className="relative rounded-full flex items-center justify-center pointer-events-none select-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div 
        className="absolute inset-2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, rgba(0,0,0,0) 80%)',
          filter: 'blur(15px)'
        }}
      />

      <div className="absolute inset-0 z-10 rounded-full overflow-hidden">
        <Canvas 
            camera={{ position: [0, 0, 4.5], fov: 35 }} 
            gl={{ 
                alpha: true, 
                antialias: true, 
                toneMapping: THREE.ACESFilmicToneMapping,
            }}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 0.75;
            }}
        >
            <Suspense fallback={null}>
                <MoonSphere phase={phase} />
            </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
