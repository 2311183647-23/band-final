
import React from 'react';
import { motion } from 'framer-motion';
import { RayBurst } from './OrbitalVisuals';
import { Reveal } from './ScrollReveal';
import type { TimelineEvent as TimelineEventType } from '../types/types';

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
  total: number;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event, index }) => {
  const isEven = index % 2 === 0;
  const delay = index * 0.1;

  return (
    <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 group ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <Reveal delay={delay + 0.2} offsetY={0} className="absolute left-8 md:left-1/2 -translate-x-[7.5px] md:-translate-x-1/2 w-4 h-4 z-10">
        <div className="w-full h-full bg-[#1A1A1C] border border-[#D4AF37] rounded-full flex items-center justify-center group-hover:scale-150 transition-transform duration-300 group-hover:bg-[#D4AF37]">
          <div className="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold transition-opacity duration-300">
            {event.phase}
          </div>
        </div>
      </Reveal>
      <Reveal delay={delay} className={`pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'} transition-all duration-500`}>
        <div className="relative p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm group-hover:border-[#D4AF37]/30 transition-colors">
            <RayBurst active={false} />
            <span className="font-pixel text-[10px] text-[#FF4500] block mb-2">{event.date}</span>
            <h4 className="font-postmodern font-light text-3xl text-white mb-2 group-hover:text-[#D4AF37] uppercase">
                {event.title}
            </h4>
            <p className="font-light text-xs text-gray-500 leading-loose">
                {event.description}
            </p>
        </div>
      </Reveal>
      <div className="hidden md:block md:w-1/2"></div>
    </div>
  );
};
