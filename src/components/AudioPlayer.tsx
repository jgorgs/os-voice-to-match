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
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [audioUrl]);

  const setupAudioContext = async () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      
      console.log('Audio context setup complete');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) {
      console.log('Missing canvas or analyser');
      return;
    }
    
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
        // Use multiple frequency bins per bar for better visualization
        const startIndex = Math.floor((i / barCount) * bufferLength);
        const endIndex = Math.floor(((i + 1) / barCount) * bufferLength);
        
        // Average the frequency data for this bar
        let sum = 0;
        for (let j = startIndex; j < endIndex; j++) {
          sum += dataArray[j];
        }
        const average = sum / (endIndex - startIndex);
        
        // Scale the bar height with more sensitivity
        const barHeight = Math.max(3, (average / 255) * canvas.height * 0.8);
        
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;
        
        // Create animated gradient based on frequency
        const intensity = average / 255;
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, `hsl(var(--primary) / ${0.3 + intensity * 0.5})`);
        gradient.addColorStop(0.5, `hsl(var(--primary) / ${0.6 + intensity * 0.4})`);
        gradient.addColorStop(1, `hsl(var(--primary) / ${0.2 + intensity * 0.3})`);
        
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
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Setup audio context before playing
        if (!audioContextRef.current) {
          await setupAudioContext();
        }
        
        // Resume context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
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
    console.log('Audio started playing');
    setIsPlaying(true);
    drawWaveform();
  };
  
  const handlePause = () => {
    console.log('Audio paused');
    setIsPlaying(false);
    drawStaticWaveform();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  const handleEnded = () => {
    console.log('Audio ended');
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
