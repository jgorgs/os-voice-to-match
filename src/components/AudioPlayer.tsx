
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioBlob: Blob;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioUrl = React.useMemo(() => {
    return URL.createObjectURL(audioBlob);
  }, [audioBlob]);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(audioUrl);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);

  const setupAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isPlaying) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barCount = 32;
      const barWidth = canvas.width / barCount;
      const barSpacing = 1;
      const actualBarWidth = barWidth - barSpacing;
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = Math.max(2, (dataArray[dataIndex] / 255) * canvas.height * 0.9);
        
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;
        
        // Create rounded bars with gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, 'hsl(var(--primary) / 0.8)');
        gradient.addColorStop(0.5, 'hsl(var(--primary))');
        gradient.addColorStop(1, 'hsl(var(--primary) / 0.6)');
        
        ctx.fillStyle = gradient;
        ctx.roundRect(x, y, actualBarWidth, barHeight, 2);
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
  };

  const drawStaticWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barCount = 32;
    const barWidth = canvas.width / barCount;
    const barSpacing = 1;
    const actualBarWidth = barWidth - barSpacing;
    
    // Create a static waveform pattern
    for (let i = 0; i < barCount; i++) {
      const baseHeight = 4 + Math.sin(i * 0.3) * 8 + Math.random() * 6;
      const barHeight = Math.max(2, baseHeight);
      
      const x = i * barWidth;
      const y = (canvas.height - barHeight) / 2;
      
      ctx.fillStyle = 'hsl(var(--muted-foreground) / 0.3)';
      ctx.roundRect(x, y, actualBarWidth, barHeight, 2);
      ctx.fill();
    }
  };

  const togglePlayback = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (!audioContextRef.current) {
          setupAudioContext();
        }
        
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
    drawStaticWaveform();
  };

  const handlePlay = () => {
    setIsPlaying(true);
    drawWaveform();
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    drawStaticWaveform();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    drawStaticWaveform();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center space-x-3 py-2">
      <button
        onClick={togglePlayback}
        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div className="flex-1 flex items-center space-x-3">
        <div className="flex items-center space-x-3 flex-1">
          <canvas
            ref={canvasRef}
            width={160}
            height={32}
            className="rounded"
            style={{ background: 'transparent' }}
          />
          
          <div className="flex-1 bg-muted rounded-full h-1.5 relative overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-100 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground min-w-[4rem] font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default AudioPlayer;
