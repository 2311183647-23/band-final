
import React from 'react';

export const CircularGauge: React.FC<{
  value: number;
  unit: string;
  label?: string;
  max?: number;
  size?: number;
  color?: string;
}> = ({ value, unit, label, max = 100, size = 80, color = '#D4AF37' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      {label && (
        <span className="font-pixel text-[8px] text-[#D4AF37] mb-2 uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="2"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 8}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            strokeOpacity="0.8"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-bold text-white">{value}</span>
          <span className="font-pixel text-[8px] text-[#D4AF37] uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export const SystemStatusPanel: React.FC<{
  title: string;
  date?: string;
  offset?: number;
  status?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ title, date, offset, status, position = 'top-left' }) => {
  const positionClasses = {
    'top-left': 'top-[10%] left-[5%] md:left-[8%]',
    'top-right': 'top-[10%] right-[5%] md:right-[8%]',
    'bottom-left': 'bottom-[10%] left-[5%] md:left-[8%]',
    'bottom-right': 'bottom-[10%] right-[5%] md:right-[8%]',
  };

  return (
    <div className={`absolute ${positionClasses[position]} pointer-events-none z-20`}>
      <div className="font-song text-base md:text-lg text-[#D4AF37] mb-2 tracking-wider">
        {title}
      </div>
      {date && (
        <div className="font-pixel text-lg md:text-xl text-white mb-1">
          ■ {date}
        </div>
      )}
      {status && offset !== undefined && (
        <div className="font-song text-sm mt-2 flex items-center gap-2 whitespace-nowrap">
          <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#FF4500] flex-shrink-0 ${status === 'SCROLL_LOCKED' ? 'bg-red-500' : 'bg-[#FF4500]'}`}></span>
          <span className="text-[#FF4500]">{status}</span>
          <span className="text-[#D4AF37]">，偏移：{offset > 0 ? '+' : ''}{offset} 天</span>
        </div>
      )}
      {status && offset === undefined && (
        <div className="font-song text-sm text-[#FF4500] mt-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#FF4500] ${status === 'SCROLL_LOCKED' ? 'bg-red-500' : 'bg-[#FF4500]'}`}></span>
          {status}
        </div>
      )}
      {!status && offset !== undefined && (
        <div className="font-song text-sm text-[#D4AF37] mt-2">
          偏移：{offset > 0 ? '+' : ''}{offset} 天
        </div>
      )}
    </div>
  );
};

export const MiniRadar: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const angle = (time / 2000) % (Math.PI * 2);
  const orbitRadius = size / 3;
  const dotX = size / 2 + Math.cos(angle) * orbitRadius;
  const dotY = size / 2 + Math.sin(angle) * orbitRadius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {[1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={(size / 2 - 10) * (i / 3)}
            fill="none"
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="1"
          />
        ))}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const x2 = size / 2 + Math.cos(rad) * (size / 2 - 10);
          const y2 = size / 2 + Math.sin(rad) * (size / 2 - 10);
          return (
            <line
              key={angle}
              x1={size / 2}
              y1={size / 2}
              x2={x2}
              y2={y2}
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="1"
            />
          );
        })}
        <circle cx={size / 2} cy={size / 2} r="3" fill="#D4AF37" />
        <circle cx={dotX} cy={dotY} r="2.5" fill="#FF4500" className="shadow-[0_0_8px_#FF4500]" />
      </svg>
    </div>
  );
};
