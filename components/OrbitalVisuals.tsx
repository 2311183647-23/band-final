
import React from 'react';
import { motion } from 'framer-motion';

export const RayBurst: React.FC<{ active?: boolean, holeSize?: string }> = ({ active = false, holeSize = '52%' }) => {
  const numericSize = parseInt(holeSize.replace('%', ''));
  const fadeEnd = numericSize + 5;

  return (
    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0" style={{ maskImage: `radial-gradient(circle, transparent ${numericSize}%, black ${fadeEnd}%)` }}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[400%] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent opacity-80 mix-blend-screen"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80 mix-blend-screen"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[1px] bg-gradient-to-r from-transparent via-[#FF4500] to-transparent opacity-60 rotate-45"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[1px] bg-gradient-to-r from-transparent via-[#FF4500] to-transparent opacity-60 -rotate-45"></div>
      </div>
    </div>
  );
};

export const SideRuler: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div className={`fixed top-0 ${side === 'left' ? 'left-4' : 'right-4'} h-full w-8 pointer-events-none z-10 flex flex-col justify-between py-24 opacity-30`}>
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className={`w-4 h-[1px] bg-[#D4AF37] ${i % 3 === 0 ? 'w-8' : ''} ${side === 'right' ? 'ml-auto' : ''}`}></div>
        {i % 4 === 0 && (
          <span className={`font-pixel text-[6px] text-[#D4AF37] ${side === 'right' ? 'text-right' : ''}`}>
            {side === 'left' ? 'RA' : 'DEC'}: {Math.floor(Math.random() * 90)}° {Math.floor(Math.random() * 60)}'
          </span>
        )}
      </div>
    ))}
    <div className={`absolute ${side === 'left' ? 'left-0' : 'right-0'} top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent border-dashed border-l border-[#D4AF37]/10`}></div>
  </div>
);

export const CornerAperture: React.FC = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    className="w-16 h-16 border border-[#D4AF37]/20 rounded-full flex items-center justify-center"
  >
    <div className="w-[1px] h-full bg-[#D4AF37]/20 absolute rotate-0"></div>
    <div className="w-[1px] h-full bg-[#D4AF37]/20 absolute rotate-45"></div>
    <div className="w-[1px] h-full bg-[#D4AF37]/20 absolute rotate-90"></div>
    <div className="w-[1px] h-full bg-[#D4AF37]/20 absolute rotate-135"></div>
    <div className="w-8 h-8 border border-[#FF4500]/30 rounded-sm rotate-45"></div>
  </motion.div>
);

export const TechFrame: React.FC<{ label?: string }> = ({ label }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
    <div className="absolute top-8 left-8 flex flex-col gap-3">
        <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#FF4500] animate-pulse"></div>
            <div className="w-8 h-[1px] bg-[#D4AF37]/40 mt-1"></div>
        </div>
        <div className="w-24 h-24 border border-[#D4AF37]/10 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#FF4500]"></div>
            <div className="absolute inset-2 border border-white/5 flex items-center justify-center">
                <div className="font-song text-xs text-[#D4AF37]/40">扫描系统激活</div>
            </div>
        </div>
    </div>
    <div className="absolute top-8 right-8 text-right">
        <div className="font-pixel text-[8px] text-[#D4AF37] mb-1">相对月面位置</div>
        <div className="font-mono text-[10px] text-white/40 tracking-tighter">
            X: 882.192.44<br/>
            Y: 002.911.08<br/>
            Z: 114.773.00
        </div>
        <div className="mt-4 flex justify-end">
            <CornerAperture />
        </div>
    </div>
    <div className="absolute bottom-8 left-8 space-y-2">
        <div className="w-32 h-[1px] bg-gradient-to-r from-[#FF4500] to-transparent"></div>
        <div className="font-song text-xs text-[#FF4500] tracking-widest">{label || '遥测链接'}</div>
        <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  className="w-1 h-3 bg-[#D4AF37]/20" 
                />
            ))}
        </div>
    </div>
    <div className="absolute bottom-16 right-8">
        <div className="relative w-20 h-20">
            <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-[#D4AF37]/10 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[6px] text-[#D4AF37]/30 text-center uppercase">
                时间<br/>标记<br/>{Math.random().toString(36).substring(7)}
            </div>
        </div>
    </div>
  </div>
);

export const TickScale: React.FC<{ count: number, radius: number, activeRotation?: number }> = ({ count, radius, activeRotation = 0 }) => {
  const step = 360 / count;
  const normalizedRotation = activeRotation % 360;
  let targetAngle = -90 - normalizedRotation;
  while (targetAngle < 0) targetAngle += 360;
  const activeIndex = Math.round(targetAngle / step) % count;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const isMajor = i % 10 === 0;
        const isMinor = i % 5 === 0;
        const dist = Math.abs(i - activeIndex);
        const isActive = dist === 0 || dist === count; 
        let h = 12; 
        let w = '1px';
        let opacity = '0.3';
        let bg = '#D4AF37'; 
        if (isMajor) { h = 40; w = '2px'; opacity = '0.8'; }
        else if (isMinor) { h = 24; opacity = '0.5'; }
        if (isActive) { bg = '#FF4500'; opacity = '1'; h = h + 15; w = '2px'; }
        const dashedCircleRadius = radius * 1.1;
        const tickCenterOffset = dashedCircleRadius - (h / 2);
        return (
          <div key={i} className="absolute transition-all duration-200" style={{
            backgroundColor: bg, width: w, height: `${h}px`, opacity: opacity, top: '50%', left: '50%',
            transform: `rotate(${i * step}deg) translateY(-${tickCenterOffset}px)`, transformOrigin: 'center center',
            boxShadow: isActive ? '0 0 10px #FF4500' : 'none'
          }} />
        );
      })}
    </div>
  );
};

export const AngleLabels: React.FC<{ radius: number, angles?: number[] }> = ({ radius, angles = [0, 45, 90, 135, 180, 225, 270, 315] }) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      {angles.map((angle) => {
        const rad = (angle - 90) * (Math.PI / 180); 
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <div key={angle} className="absolute font-pixel text-[10px] text-[#D4AF37]/60" style={{
            left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)',
          }}> {angle}° </div>
        );
      })}
    </div>
  );
};

export const Crosshair: React.FC<{ className?: string, color?: string }> = ({ className = "", color = "bg-[#FF4500]" }) => (
  <div className={`relative w-4 h-4 ${className} opacity-80`}>
    <div className={`absolute top-1/2 left-0 w-full h-[1px] ${color} transform -translate-y-1/2`}></div>
    <div className={`absolute left-1/2 top-0 h-full w-[1px] ${color} transform -translate-x-1/2`}></div>
  </div>
);
