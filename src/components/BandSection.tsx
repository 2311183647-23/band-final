
import React from 'react';
import { motion } from 'framer-motion';
import { RayBurst, Crosshair, TechFrame } from './OrbitalVisuals';
import Marquee from './Marquee';
import { ScrollSection, Reveal } from './ScrollReveal';

const IMAGES = [
  `${import.meta.env.BASE_URL}assets/band3.jpg`,
  `${import.meta.env.BASE_URL}assets/band2.jpg`,
  `${import.meta.env.BASE_URL}assets/band1.jpg`
];

export const BandSection: React.FC = () => {
  return (
    <ScrollSection id="band" className="relative min-h-screen w-full py-32 px-6 md:px-24 border-b border-[#D4AF37]/5 overflow-hidden">
       <TechFrame label="起源数据扫描器" />
       <div className="absolute right-0 top-0 w-1/3 h-full border-l border-[#D4AF37]/5 pointer-events-none"></div>
       <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-5/12 pt-12 space-y-16 z-10">
             <Reveal className="group relative" data-hover="true">
                <RayBurst />
                <div className="flex items-center gap-2 mb-4 opacity-50">
                  <Crosshair color="bg-[#FF4500]" />
                  <h2 className="font-song text-base tracking-[0.3em] text-[#D4AF37]">起源故事</h2>
                </div>
                <h3 className="font-postmodern text-3xl text-white mb-6 leading-relaxed group-hover:text-[#D4AF37] transition-colors">
                   诞生于cc98电台的静电噪音中。
                </h3>
                <p className="font-light text-sm text-gray-400 leading-loose text-justify">
                   月相乐队成立于2025年11月，由一群热爱音乐的浙江大学学生组成。我们是一支融合了英式摇滚的忧郁、后朋克的驱动节奏和流行摇滚的旋律的声音碰撞乐队。我们不仅演奏音乐；我们绘制虚空的情绪坐标。
                </p>
             </Reveal>
             
             <Reveal delay={0.2} className="pl-6 border-l border-[#FF4500]/30 group relative" data-hover="true">
                <RayBurst />
                <h4 className="font-song text-base text-[#D4AF37] mb-2">活动基地</h4>
                <p className="font-postmodern text-xl text-gray-300 group-hover:text-white transition-colors">蓝田学园三栋辅楼<br/>202</p>
             </Reveal>
          </div>
          
          <div className="w-full md:w-7/12 relative min-h-[600px]">
             <Reveal className="absolute top-0 left-0 w-64 aspect-[3/4] group cursor-none" initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} data-hover="true">
                <div className="relative w-full h-full overflow-hidden border border-[#D4AF37]/20 group-hover:border-[#FF4500]/50 transition-colors">
                   <img src={IMAGES[0]} className="w-full h-full object-contain filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="font-pixel text-[9px] text-[#FF4500]">现场录音_01</span>
                   </div>
                </div>
                <div className="absolute top-1/2 -left-32 w-32 h-[1px] bg-[#FF4500] scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"></div>
                <RayBurst />
             </Reveal>
             
             <Reveal delay={0.3} className="absolute top-20 right-10 w-56 aspect-square group cursor-none" initial={{ y: 0 }} animate={{ y: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} data-hover="true">
                <div className="relative w-full h-full overflow-hidden border border-[#D4AF37]/20 group-hover:border-[#FF4500]/50 transition-colors shadow-2xl">
                   <img src={IMAGES[1]} className="w-full h-full object-contain filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500" />
                </div>
                <RayBurst />
             </Reveal>
             
             <Reveal delay={0.5} className="absolute bottom-10 left-20 w-72 aspect-video group cursor-none" initial={{ y: 0 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }} data-hover="true">
                <div className="relative w-full h-full overflow-hidden border border-[#D4AF37]/20 group-hover:border-[#FF4500]/50 transition-colors">
                   <img src={IMAGES[2]} className="w-full h-full object-contain filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500" />
                   <div className="absolute -bottom-6 left-0 font-pixel text-[9px] text-[#D4AF37]/50 group-hover:text-[#FF4500] transition-colors">
                      排练日志_#404
                   </div>
                </div>
                <RayBurst />
             </Reveal>
          </div>
       </div>
       <Marquee text="乐队简介 · 成立于 2023 · 风格：后朋克 / 英式摇滚 · 传输活跃" className="border-t-0" />
    </ScrollSection>
  );
};
