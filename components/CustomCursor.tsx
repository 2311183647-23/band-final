
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const realMouse = useRef({ x: -100, y: -100 });
  const isMoving = useRef(false);
  const movementTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      realMouse.current = { x: e.clientX, y: e.clientY };
      isMoving.current = true;
      
      if (movementTimeout.current) clearTimeout(movementTimeout.current);
      movementTimeout.current = setTimeout(() => {
        isMoving.current = false;
      }, 100);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('input') || 
                        target.closest('textarea') || 
                        target.closest('[data-hover="true"]');
      
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      decay: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];
    const maxParticles = 80;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const spawnChance = isHovering ? 0.8 : (isMoving.current ? 0.3 : 0.05); 
      const speedBase = isHovering ? 0.6 : 0.15; 
      const sizeBase = isHovering ? 1.2 : 0.8;
      
      if (particles.length < maxParticles && Math.random() < spawnChance) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * speedBase + 0.05;
        
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const isGold = Math.random() > 0.6;
        
        particles.push({
            x: realMouse.current.x,
            y: realMouse.current.y,
            vx: vx,
            vy: vy,
            life: 1.0,
            decay: 0.003 + Math.random() * 0.005,
            size: Math.random() * sizeBase + 0.5,
            color: isHovering 
                ? (isGold ? '212, 175, 55' : '255, 69, 0')
                : '200, 200, 200'
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.life * (isHovering ? 0.6 : 0.3)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering]);

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998] mix-blend-screen"
      />
      
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center hidden md:flex"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="relative rounded-full bg-white flex items-center justify-center"
          animate={{
            width: isHovering ? 24 : 8,
            height: isHovering ? 24 : 8,
            opacity: 1,
            scale: isHovering ? 1.2 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <div className="absolute inset-0 rounded-full bg-white blur-sm opacity-50"></div>
        </motion.div>

        <motion.div 
            className="absolute border border-white/40 rounded-full"
            animate={{
                width: isHovering ? 50 : 0,
                height: isHovering ? 50 : 0,
                opacity: isHovering ? 1 : 0,
                rotate: isHovering ? 180 : 0
            }}
            transition={{ duration: 0.5 }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
