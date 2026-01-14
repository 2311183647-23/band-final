
import React, { useState, useRef } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { MEMBERS, TIMELINE } from './data/constants';
import { Crosshair, RayBurst, TechFrame, SideRuler } from './components/OrbitalVisuals';
import { MoonDial } from './components/MoonDial';
import { BandSection } from './components/BandSection';
import { MusicSection } from './components/MusicSection';
import { Navigation } from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import Marquee from './components/Marquee';
import { ArrowUpRight } from 'lucide-react';
import { ScrollSection, Reveal } from './components/ScrollReveal';
import { TimelineEvent } from './components/TimelineEvent';

interface SentMessage {
  id: number;
  text: string;
  x: number; 
  y: number; 
  rotation: number;
}

export default function App() {
  const [messageInput, setMessageInput] = useState("");
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
  
  const timelineRef = useRef<HTMLElement>(null);
  const trackerY = useMotionValue(0);
  const smoothTrackerY = useSpring(trackerY, { damping: 25, stiffness: 300 });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: SentMessage = {
      id: Date.now(),
      text: messageInput,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      rotation: (Math.random() - 0.5) * 10
    };

    setSentMessages(prev => [...prev, newMessage]);
    setMessageInput("");
  };

  const handleTimelineMouseMove = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    trackerY.set(e.clientY - rect.top);
  };

  return (
    <main className="relative w-full min-h-screen bg-[#1A1A1C] text-[#E5E5E5] overflow-hidden selection:bg-[#D4AF37]/30 selection:text-white">
      <CustomCursor />
      <Navigation />
      
      <SideRuler side="left" />
      <SideRuler side="right" />

      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at center, #2D3045 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <MoonDial />
      <BandSection />

      <ScrollSection id="members" className="relative min-h-screen w-full py-32 px-6 md:px-20 border-b border-[#D4AF37]/5">
        <TechFrame label="生物识别扫描器_v2" />
        <Reveal className="absolute top-24 left-6 flex items-center gap-2 opacity-50">
          <Crosshair color="bg-[#FF4500]" />
          <h2 className="font-pixel text-[10px] tracking-[0.3em] text-[#D4AF37]"></h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mt-20">
          {MEMBERS.map((member, index) => (
            <Reveal key={member.id} delay={index * 0.15} className="relative group" data-hover="true">
               <RayBurst />
               <div className="absolute -top-6 left-0 w-full h-[1px] bg-[#D4AF37]/20 group-hover:bg-[#FF4500]/50 transition-colors"></div>
               <div className="absolute -top-6 left-0 w-[1px] h-4 bg-[#D4AF37]/20 group-hover:bg-[#FF4500]/50 transition-colors"></div>

               <div className="relative z-10 p-2 cursor-none">
                  <div className="flex justify-between items-end mb-8">
                    <h3 className="font-postmodern font-thin text-4xl text-[#E5E5E5] group-hover:text-[#D4AF37] transition-colors tracking-wide">
                      {member.name}
                    </h3>
                    <span className="font-song text-sm text-[#FF4500] mb-1 block bg-[#FF4500]/10 px-2 py-1">{member.role}</span>
                  </div>
                  
                  {member.isPlaceholder ? (
                    <div className="h-[200px] w-full flex items-center justify-center border border-dashed border-[#D4AF37]/20 text-[10px] font-pixel text-[#D4AF37] animate-pulse">
                      等待信号中...
                    </div>
                  ) : (
                    <div className="h-[200px] w-full relative -ml-6 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                          { subject: '贪睡指数', A: member.stats.sleepDeprivation, fullMark: 100 },
                          { subject: '疯狂指数', A: member.stats.madness, fullMark: 100 },
                          { subject: '酒精依赖指数', A: member.stats.alcoholDependency, fullMark: 100 },
                          { subject: '排练迟到指数', A: member.stats.rehearsalLateness, fullMark: 100 },
                          { subject: '节拍器依赖指数', A: member.stats.metronomeDependency, fullMark: 100 },
                        ]}>
                          <PolarGrid stroke="#2D3045" strokeWidth={0.5} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#D4AF37', fontSize: 8, fontFamily: 'Silkscreen', opacity: 1 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name={member.name}
                            dataKey="A"
                            stroke="#D4AF37"
                            strokeWidth={1}
                            fill="#D4AF37"
                            fillOpacity={0.2}
                            className="group-hover:fill-opacity-50 transition-all duration-500"
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="mt-8 space-y-4">
                    <p className="font-pixel text-[8px] text-[#D4AF37] uppercase tracking-widest">
                      MBTI: <span className="text-[#E5E5E5]">{member.mbti}</span>
                    </p>
                    <p className="font-light italic text-sm text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed border-l border-[#D4AF37]/40 pl-4">
                      "{member.quote}"
                    </p>
                  </div>
               </div>
            </Reveal>
          ))}
        </div>
        <Marquee text="船员状态 · 活跃 · 等待成员 06 · 信号强度 98%" className="border-t-0" />
      </ScrollSection>

      <ScrollSection 
        id="timeline" 
        ref={timelineRef}
        onMouseMove={handleTimelineMouseMove}
        className="relative min-h-screen w-full flex flex-col items-center py-32 border-b border-[#D4AF37]/5" 
        offsetY={80} 
        hiddenOpacity={0}
      >
        <TechFrame label="时间轴_v1.0" />
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-[#D4AF37]/20 md:-translate-x-1/2 pointer-events-none">
           <motion.div 
              style={{ y: smoothTrackerY }}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF4500] rounded-full z-20 shadow-[0_0_12px_#FF4500]"
           >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[1px] bg-gradient-to-r from-transparent via-[#FF4500]/20 to-transparent"></div>
           </motion.div>
        </div>
        <div className="relative w-full max-w-5xl px-8 md:px-0 z-10">
          <div className="space-y-24">
            {TIMELINE.map((event, idx) => (
              <TimelineEvent key={event.id} event={event} index={idx} total={TIMELINE.length} />
            ))}
          </div>
        </div>
        <Marquee text="时间日志 · 过往事件已归档 · 未来事件计算中" className="border-t-0" />
      </ScrollSection>

      <MusicSection />

      <ScrollSection id="logs" className="relative w-full py-32 px-6 md:px-24 border-b border-[#D4AF37]/5">
        <TechFrame label="数据完整性检查" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 font-mono text-[10px] md:text-xs text-[#E5E5E5]">
           <Reveal delay={0} className="space-y-8 border-l border-[#D4AF37]/30 pl-6 group relative" data-hover="true">
             <RayBurst />
             <p className="font-pixel text-[#FF4500]">[2025.11.04]</p>
             <p className="leading-loose">断弦更换费用：145.00元。<br/>资金状态：<span className="text-[#FF4500] font-bold">紧急</span>。</p>
           </Reveal>
           <Reveal delay={0.15} className="space-y-8 border-l border-[#D4AF37]/30 pl-6 mt-12 md:mt-0 group relative" data-hover="true">
             <RayBurst />
             <p className="font-pixel text-[#FF4500]">[2026.01.2]</p>
             <p className="leading-loose">排练室租金：260.00元</p>
           </Reveal>
        </div>
        <Marquee text="系统日志 · 财务状况：不稳定 · 艺术状态：巅峰" className="border-t-0" />
      </ScrollSection>

      <ScrollSection id="contact" className="relative min-h-[60vh] w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-32 py-20 border-t border-[#D4AF37]/5 pb-24 overflow-hidden">
         <TechFrame label="上行信号界面" />
         <AnimatePresence>
            {sentMessages.map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute border border-[#FF4500] p-3 font-mono text-[9px] text-[#D4AF37] max-w-[200px] backdrop-blur-md z-0"
                    style={{ top: `${msg.y}%`, left: `${msg.x}%`, rotate: `${msg.rotation}deg` }}
                >
                    <p className="leading-relaxed text-white">{msg.text}</p>
                </motion.div>
            ))}
         </AnimatePresence>
         <Reveal className="w-full max-w-lg mb-16 md:mb-0 z-10">
            <h2 className="font-postmodern font-thin text-4xl text-white mb-12">发送信号</h2>
            <form className="space-y-12" onSubmit={handleSendMessage}>
              <div className="group relative" data-hover="true">
                <input type="text" placeholder="请输入您的标识符（姓名）" className="w-full bg-transparent border-b border-[#D4AF37]/60 py-3 font-mono text-sm text-[#D4AF37] focus:outline-none focus:border-[#FF4500] transition-colors" />
                <RayBurst />
              </div>
              <div className="group relative" data-hover="true">
                <textarea rows={1} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="请输入您的信号内容（消息）" className="w-full bg-transparent border-b border-[#D4AF37]/60 py-3 font-mono text-sm text-[#D4AF37] focus:outline-none focus:border-[#FF4500] transition-colors resize-none overflow-hidden" />
                 <RayBurst />
              </div>
              <button type="submit" data-hover="true" className="text-[10px] tracking-[0.3em] text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 group relative py-2">
                [ 发送 ]
                <ArrowUpRight size={10} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
         </Reveal>
         <Reveal className="w-full max-w-lg md:max-w-none md:w-auto z-10 mt-16 md:mt-0">
            <div className="text-center md:text-left">
              <p className="font-song text-sm text-[#D4AF37]/70 mb-2">小红书</p>
              <p className="font-postmodern text-xl text-white">月相乐队themoonphase</p>
            </div>
         </Reveal>
         <Marquee text="传输结束 · 感谢收听 · 断开连接中..." className="border-t-0" />
      </ScrollSection>
    </main>
  );
}
