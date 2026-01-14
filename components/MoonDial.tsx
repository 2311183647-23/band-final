
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValueEvent, AnimatePresence, Variants } from 'framer-motion';
import { Moon } from './Moon';
import { TickScale, AngleLabels } from './OrbitalVisuals';
import { 
  CircularGauge, 
  SystemStatusPanel, 
  MiniRadar
} from './DataPanels';
import Marquee from './Marquee';
import { ScrollSection } from './ScrollReveal';

const LUNAR_CYCLE = 29.53058867;
const MOON_SIZE_PX = 400; 
const TICK_RADIUS = (MOON_SIZE_PX / 2) + 60;
const FULL_MOON_TARGET = 0.5;
const TOLERANCE = 0.02; 

const getRealMoonPhase = (date: Date) => {
    const REFERENCE_NEW_MOON = new Date("2000-01-06T18:14:00Z");
    const diffTime = date.getTime() - REFERENCE_NEW_MOON.getTime();
    const diffDays = diffTime / 86400000;
    let currentCycle = (diffDays % LUNAR_CYCLE) / LUNAR_CYCLE;
    if (currentCycle < 0) currentCycle += 1;
    return currentCycle;
};

export const MoonDial: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startDate = useMemo(() => new Date(), []);
  const startPhase = useMemo(() => getRealMoonPhase(startDate), [startDate]);
  const startRotation = startPhase * 360;

  const [rotationValue, setRotationValue] = useState(startRotation);
  const [currentRotation, setCurrentRotation] = useState(startRotation);
  const [phase, setPhase] = useState(startPhase);
  const [date, setDate] = useState(startDate);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const rotationSpring = useSpring(startRotation, { damping: 130, stiffness: 260, mass: 7 });

  const sideItemVariants = (delay: number): Variants => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }
    }
  });

  const phaseDist = useMemo(() => {
    const d = Math.abs(phase - FULL_MOON_TARGET);
    return Math.min(d, 1 - d);
  }, [phase]);

  const unlockProgress = Math.max(0, 1 - (phaseDist / 0.25)); 

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleGlobalWheel = (e: WheelEvent) => {
      const sensitivity = 0.15; 
      const clampedDelta = Math.max(-100, Math.min(100, e.deltaY));
      
      setRotationValue(prev => {
        const next = prev + clampedDelta * sensitivity;
        rotationSpring.set(next);
        
        if (!isUnlocked) {
          let normalizedAngle = next % 360;
          if (normalizedAngle < 0) normalizedAngle += 360;
          const nextPhase = normalizedAngle / 360;
          
          if (Math.abs(nextPhase - FULL_MOON_TARGET) < TOLERANCE) {
            setIsUnlocked(true);
          }
        }
        return next;
      });

      if (!isUnlocked) {
        e.preventDefault();
      }
    };

    element.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleGlobalWheel);
  }, [isUnlocked, rotationSpring]);

  useMotionValueEvent(rotationSpring, "change", (latest) => {
      setCurrentRotation(latest);
      const degreesDiff = latest - startRotation;
      const daysPassed = (degreesDiff / 360) * LUNAR_CYCLE;
      const newDate = new Date(startDate);
      newDate.setTime(newDate.getTime() + (daysPassed * 24 * 60 * 60 * 1000));
      setDate(newDate);
      let normalizedAngle = latest % 360;
      if (normalizedAngle < 0) normalizedAngle += 360;
      setPhase(normalizedAngle / 360);
  });

  const dialRotation = useTransform(rotationSpring, (r) => `${r}deg`);
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase();
  
  const getLunarString = (p: number) => {
     const day = Math.floor(p * LUNAR_CYCLE);
     let phaseName = "";
     if (p < 0.0625) phaseName = "新月";
     else if (p < 0.1875) phaseName = "上弦月";
     else if (p < 0.3125) phaseName = "上弦月";
     else if (p < 0.4375) phaseName = "盈凸月";
     else if (p < 0.5625) phaseName = "满月";
     else if (p < 0.6875) phaseName = "亏凸月";
     else if (p < 0.8125) phaseName = "下弦月";
     else if (p < 0.9375) phaseName = "残月";
     else phaseName = "新月";
     return { day: `第 ${day} 天`, phase: phaseName.toUpperCase() };
  };

  const lunarInfo = getLunarString(phase);
  const offsetDays = useMemo(() => {
    const diffTime = date.getTime() - startDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }, [date, startDate]);

  return (
    <ScrollSection 
      id="home" 
      ref={containerRef}
      initial="hidden"
      animate="visible"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#030305] cursor-ns-resize"
    >
        <motion.div variants={sideItemVariants(0)} className="absolute left-[5%] lg:left-[6%] top-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <h1 className="font-pixel text-7xl tracking-[0.1em] text-white leading-[1.1]">
             THE<br /><span className="text-[#D4AF37]">MOON</span><br />PHASE
           </h1>
        </motion.div>

        <motion.div variants={sideItemVariants(0.5)} className="absolute right-[5%] lg:right-[6%] top-1/2 -translate-y-1/2 z-40 text-right pointer-events-none max-w-[35%]">
             <div className="mb-10">

                <div className="font-pixel text-4xl text-white leading-none">{formatDate(date)}</div>
             </div>
             <div>
                <div className="font-song text-5xl text-[#D4AF37] leading-none mb-3">{lunarInfo.day}</div>
                <div className="font-song text-5xl text-white tracking-[0.05em] uppercase">{lunarInfo.phase}</div>
             </div>
        </motion.div>

        <motion.div variants={sideItemVariants(0.8)} className="absolute top-12 left-12 z-40">
           <SystemStatusPanel title={lunarInfo.phase} date={formatDate(date)} offset={offsetDays} status={isUnlocked ? "上行稳定" : "朔望对齐请求"} />
        </motion.div>

        <motion.div style={{ rotate: dialRotation, x: "-50%", y: "-50%" }} className="absolute left-1/2 top-1/2 z-0 pointer-events-none">
            <TickScale count={144} radius={TICK_RADIUS} activeRotation={currentRotation} />
            <AngleLabels radius={TICK_RADIUS + 40} />
        </motion.div>

        <div className="relative z-20 flex items-center justify-center">
            <Moon phase={phase} size={MOON_SIZE_PX} />
            <AnimatePresence>
              {!isUnlocked && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="0.5" />
                    <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#FF4500" strokeWidth="1.2" strokeDasharray="301.59" style={{ strokeDashoffset: 301.59 * (1 - unlockProgress) }} />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!isUnlocked && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-64 pointer-events-none z-30"
                >
                  <div className="font-song text-sm text-[#FF4500] animate-pulse">请求滚动滚轮，对齐朔望中...</div>
                  <div className="font-song text-base text-white mt-1 uppercase">对齐进度：{Math.round(unlockProgress * 100)}%</div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 96 }} transition={{ delay: 1.5, duration: 1.0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ marginTop: `-${TICK_RADIUS + 70}px` }}>
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF4500] to-[#FF4500]"></div>
        </motion.div>

        <Marquee text={`月相：${lunarInfo.phase} · 校准：${isUnlocked ? '正常' : '锁定'}`} />
    </ScrollSection>
  );
};
