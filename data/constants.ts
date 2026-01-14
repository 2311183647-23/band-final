
import { Member, TimelineEvent, Track } from '../types/types';

export const MEMBERS: Member[] = [
  {
    id: 'm1',
    name: '陈小美',
    role: '主唱 / 吉他',
    mbti: 'ESTP-A',
    quote: "让我们回到britpop最辉煌的年代吧！",
    stats: { sleepDeprivation: 100, madness: 80, alcoholDependency: 10, rehearsalLateness: 80, metronomeDependency: 50 }
  },
  {
    id: 'm2',
    name: '陈可钰',
    role: '主音吉他',
    mbti: 'ISTP-A',
    quote: "博士要读五年。。。",
    stats: { sleepDeprivation: 60, madness: 30, alcoholDependency: 80, rehearsalLateness: 10, metronomeDependency: 95 }
  },
  {
    id: 'm3',
    name: '王正浩 / 和声',
    role: '合成器',
    mbti: 'INTJ',
    quote: "音乐和数学是生活的解药",
    stats: { sleepDeprivation: 85, madness: 50, alcoholDependency: 20, rehearsalLateness: 0, metronomeDependency: 100 }
  },
  {
    id: 'm4',
    name: '张伦扬',
    role: '鼓手',
    mbti: 'ESTP',
    quote: "将混沌理论应用于打击乐。",
    stats: { sleepDeprivation: 70, madness: 95, alcoholDependency: 90, rehearsalLateness: 60, metronomeDependency: 40 }
  },
  {
    id: 'm5',
    name: '华艺凡',
    role: '贝斯',
    mbti: 'INFJ',
    quote: "好好练琴，编织寂静。",
    stats: { sleepDeprivation: 60, madness: 10, alcoholDependency: 60, rehearsalLateness: 15, metronomeDependency: 60 }
  },
  {
    id: 'm6',
    name: '待定',
    role: '期待新的信号...',
    mbti: '????',
    quote: "轨道开放，等待碰撞。",
    isPlaceholder: true,
    stats: { sleepDeprivation: 0, madness: 0, alcoholDependency: 0, rehearsalLateness: 0, metronomeDependency: 0 }
  }
];

export const TIMELINE: TimelineEvent[] = [
  { id: 't1', date: '2025.5', title: '前身乐队解散', description: '月牙楼之子部分成员参加了计算机学院的毕业晚会', phase: '◐' },
  { id: 't2', date: '2025.6 -2025.10', title: '相遇', description: '因为共同的音乐爱好，一群人走到了一起', phase: '●' },
  { id: 't3', date: '2025.11.23', title: '暖冬回音',description: '熟悉的农医馆 熟悉的朋友们。ceremony首演', phase: '◑' },
  { id: 't4', date: '2025.12.1', title: '潮汐音乐节', description: '新人乐队音乐节初体验', phase: '☾' },
  { id: 't5', date: '2026.4', title: '未完待续...', description: '可能即将参加浙大半夏音乐节', phase: '○' },
];

export const TRACKS: Track[] = [
  { 
    id: 'tr1', 
    title: '艳火', 
    type: '翻唱', 
    duration: '04:23',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=25706282.mp3',
    iframeUrl: 'https://music.163.com/outchain/player?type=2&id=453927798&auto=1&height=66'
  },
  { 
    id: 'tr2', 
    title: 'Ceremony', 
    type: '翻唱', 
    duration: '04:24',
    audioUrl: 'https://archive.org/download/new-order-ceremony/Ceremony.mp3',
    iframeUrl: 'https://music.163.com/outchain/player?type=2&id=4133536&auto=1&height=66'
  },
  { 
    id: 'tr3', 
    title: 'What You Know', 
    type: '翻唱', 
    duration: '03:11',
    audioUrl: 'https://archive.org/download/two-door-cinema-club-what-you-know/What_You_Know.mp3',
    iframeUrl: 'https://music.163.com/outchain/player?type=2&id=19610382&auto=1&height=66'
  },
  { 
    id: 'tr4', 
    title: '202', 
    type: '原创', 
    duration: '03:30',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_01_-_Algorithms.mp3'
  },
  { 
    id: 'tr5', 
    title: '距离', 
    type: '原创', 
    duration: '04:05',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Lobo_Loco/Vagabond/Lobo_Loco_-_06_-_Brain_Vibration_ID_1608.mp3'
  },
];
