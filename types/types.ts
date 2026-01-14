
export interface MemberStats {
  sleepDeprivation: number;
  madness: number;
  alcoholDependency: number;
  rehearsalLateness: number;
  metronomeDependency: number;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  mbti: string;
  quote: string;
  isPlaceholder?: boolean;
  stats: MemberStats;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  phase: string; 
}

export interface Track {
  id: string;
  title: string;
  type: '原创' | '翻唱';
  duration: string;
  audioUrl: string;
  iframeUrl?: string;
}
