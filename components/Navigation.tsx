
import React from 'react';

export const Navigation: React.FC = () => {
  const navItems = ['首页', '乐队', '成员', '时间轴', '音乐', '近况', '联系'];
  const sectionMap: { [key: string]: string } = {
    '首页': 'home',
    '乐队': 'band',
    '成员': 'members',
    '时间轴': 'timeline',
    '音乐': 'music',
    '近况': 'logs',
    '联系': 'contact'
  };

  const scrollToSection = (item: string) => {
    const sectionId = sectionMap[item];
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center items-start pt-6 mix-blend-difference pointer-events-none">
      <div className="flex gap-6 md:gap-12 pointer-events-auto flex-wrap justify-center px-4">
        {navItems.map((item, index) => (
          <button
            key={item}
            data-hover="true"
            onClick={() => scrollToSection(item)}
            className="group relative flex flex-col items-center gap-1"
          >
            <span className="font-pixel text-[8px] text-[#FF4500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-4">
              0{index + 1}
            </span>

            <span className="text-[10px] md:text-xs tracking-[0.2em] font-light text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition-colors relative z-10">
              {item}
            </span>
            
            <div className="w-full h-[1px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[200%] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </button>
        ))}
      </div>
    </nav>
  );
};
