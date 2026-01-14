
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Radio, Loader2, AlertCircle } from 'lucide-react';
import { TRACKS } from '../data/constants';
import { RayBurst } from './OrbitalVisuals';
import Marquee from './Marquee';
import { ScrollSection, Reveal } from './ScrollReveal';

export const MusicSection: React.FC = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showIframe, setShowIframe] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = 0.5;
    audioRef.current = audio;
    
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
        setIsLoading(false);
        setHasError(false);
        if (isPlayingRef.current) {
             audio.play().catch(e => console.warn("Auto-play blocked:", e));
        }
    };
    const handleWaiting = () => setIsLoading(true);
    const handleError = () => {
        setIsLoading(false);
        setIsPlaying(false);
        setHasError(true);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
        audio.pause();
        audio.src = "";
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrackId) {
        const track = TRACKS.find(t => t.id === currentTrackId);
        if (!track) return;

        // 如果是 iframe 曲目，不处理 audio
        if (track.iframeUrl) return;

        if (audio.src !== track.audioUrl) {
            setHasError(false);
            setIsLoading(true);
            audio.src = track.audioUrl;
            audio.load();
        } else {
            if (isPlaying) {
                if (hasError) {
                    setIsPlaying(false);
                    return;
                }
                if (audio.readyState >= 3) {
                    audio.play().catch(() => setIsPlaying(false));
                } else {
                    setIsLoading(true);
                }
            } else {
                audio.pause();
            }
        }
    } else {
        audio.pause();
        setIsPlaying(false);
    }
  }, [currentTrackId, isPlaying]);

  // 监听 audio 播放进度
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleTimeUpdate = () => updateProgress();
    const handleLoadedMetadata = () => {
      setCurrentTime(0);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrackId]);

  // 对于 iframe 曲目，使用定时器模拟进度
  useEffect(() => {
    if (currentTrackId) {
      const track = TRACKS.find(t => t.id === currentTrackId);
      if (track?.iframeUrl && isPlaying) {
        // 解析时长（格式：MM:SS）
        const [minutes, seconds] = track.duration.split(':').map(Number);
        const totalSeconds = minutes * 60 + seconds;
        
        let elapsed = 0;
        progressIntervalRef.current = setInterval(() => {
          elapsed += 0.1;
          if (elapsed >= totalSeconds) {
            elapsed = totalSeconds;
            setIsPlaying(false);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }
          setCurrentTime(elapsed);
          setProgress((elapsed / totalSeconds) * 100);
        }, 100);
      } else {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(0);
      setCurrentTime(0);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentTrackId, isPlaying]);

  const handleTrackToggle = (id: string) => {
    const track = TRACKS.find(t => t.id === id);
    if (!track) return;

    if (track.iframeUrl) {
      // 对于有 iframe 的曲目
      if (currentTrackId === id && isPlaying) {
        // 暂停：移除 iframe src 来停止播放
        setIsPlaying(false);
        const iframe = iframeRefs.current[id];
        if (iframe) {
          iframe.src = '';
        }
      } else {
        // 播放：设置 iframe src 并自动播放
        setShowIframe(id);
        setCurrentTrackId(id);
        setIsPlaying(true);
        setProgress(0);
        setCurrentTime(0);
      }
    } else {
      // 对于普通音频曲目
      if (currentTrackId === id) {
        setIsPlaying(!isPlaying);
      } else {
        setHasError(false);
        setCurrentTrackId(id);
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTrack = TRACKS.find(t => t.id === currentTrackId);

  return (
    <ScrollSection id="music" className="relative min-h-[60vh] w-full flex flex-col items-center justify-center py-32 overflow-hidden border-b border-[#D4AF37]/5">
        <div className="z-10 w-full max-w-2xl px-8">
          <Reveal className="mb-16 flex items-center justify-center gap-4">
             <Radio className={`text-[#FF4500] w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
             <h2 className="font-song text-base tracking-[0.3em] text-[#D4AF37]">音频传输</h2>
          </Reveal>
          <div className="space-y-8">
            {TRACKS.map((track, index) => (
              <div key={track.id}>
                <Reveal delay={index * 0.1} onClick={() => handleTrackToggle(track.id)} data-hover="true" className="group relative cursor-pointer pl-6 transition-all duration-500 hover:pl-10">
                  <RayBurst />
                  {currentTrackId === track.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#FF4500] shadow-[0_0_10px_#FF4500]"></div>
                  )}
                  <div className="flex justify-between items-baseline border-b border-[#D4AF37]/10 pb-4 group-hover:border-[#D4AF37]/50 transition-colors">
                    <div>
                      <span className="block font-song text-sm text-[#D4AF37]/50 mb-1 tracking-widest">{track.type.toUpperCase()}</span>
                      <h3 className={`font-postmodern text-2xl font-light tracking-widest ${currentTrackId === track.id ? 'text-[#D4AF37]' : 'text-gray-500'} group-hover:text-white transition-colors`}>
                        {track.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-pixel text-[9px] text-gray-600 tracking-wider">{track.duration}</span>
                      <div className="w-4 h-4 flex items-center justify-center">
                          {track.iframeUrl ? (
                            showIframe === track.id && isPlaying ? 
                            <Pause size={14} className="text-[#FF4500]" /> : 
                            <Play size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]"/>
                          ) : (
                            currentTrackId === track.id && isLoading ? (
                                <Loader2 size={14} className="animate-spin text-[#FF4500]" />
                            ) : currentTrackId === track.id && hasError ? (
                                <AlertCircle size={14} className="text-red-500" />
                            ) : (
                                currentTrackId === track.id && isPlaying ? 
                                <Pause size={14} className="text-[#FF4500]" /> : 
                                <Play size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]"/>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                </Reveal>
                {track.iframeUrl && (
                  <div className="hidden">
                    <iframe 
                      ref={(el) => {
                        if (el) {
                          iframeRefs.current[track.id] = el;
                        } else {
                          delete iframeRefs.current[track.id];
                        }
                      }}
                      frameBorder="no" 
                      style={{ border: '0' }}
                      width={330} 
                      height={86} 
                      src={showIframe === track.id && isPlaying ? track.iframeUrl : undefined}
                      className="rounded"
                      allow="autoplay"
                    ></iframe>
                  </div>
                )}
                {currentTrackId === track.id && (
                  <div className="mt-4 ml-6 space-y-2">
                    <div className="relative h-1 bg-[#D4AF37]/20 rounded-full overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 h-full bg-[#FF4500] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-pixel text-[#D4AF37]/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{track.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Marquee text={`音频流 · ${hasError ? '信号丢失' : isPlaying ? '传输信号中...' : '待机'} · ${currentTrack ? currentTrack.title : '无信号'}`} className="border-t-0" />
    </ScrollSection>
  );
};
