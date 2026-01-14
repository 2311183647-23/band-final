
import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  text?: string;
  className?: string;
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ 
  text = "MOON PHASE · OFFICIAL BAND SITE · EST. 2025 · NEXT GIG: NEW YEAR VOID // 2025.12.31", 
  className = "",
  speed = 40
}) => {
  return (
    <div className={`fixed bottom-0 left-0 w-full z-[100] border-t border-[#D4AF37]/10 bg-[#0F0F11]/50 backdrop-blur-[2px] overflow-hidden pointer-events-none select-none h-8 flex items-center ${className}`}>
      <div className="absolute top-0 left-0 w-1 h-1 bg-[#FF4500]"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-[#FF4500]"></div>

      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: "-50%" }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1, 2, 3].map((setIndex) => (
          <div key={setIndex} className="flex shrink-0 items-center">
            <span className="font-song text-sm text-[#D4AF37]/60 tracking-[0.1em] px-4">
              {text}
            </span>
            <div className="w-2 h-[1px] bg-[#FF4500]/50 mx-2"></div>
            <span className="font-song text-sm text-[#D4AF37]/40 tracking-[0.1em] px-4">
               LAT: 34.05° N · LON: 118.24° W
            </span>
            <div className="w-2 h-[1px] bg-[#FF4500]/50 mx-2"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
