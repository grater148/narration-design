
"use client";

import { useState, useRef, useEffect, type RefObject } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audioSrc: string;
  trackTitle?: string;
}

export function AudioPlayer({ audioSrc, trackTitle = "Audio Sample" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef: RefObject<HTMLAudioElement> = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        // Ensure duration is a valid number, default to 0 if NaN
        const audioDuration = audio.duration;
        setDuration(isNaN(audioDuration) ? 0 : audioDuration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0); // Reset currentTime when audio ends to show full duration again
      });

      // Set initial volume
      audio.volume = volume;

      // If audioSrc changes, reset states
      setIsPlaying(false);
      setCurrentTime(0);
      // Attempt to load metadata for the new source
      audio.load(); 

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentTime(0);
        });
      };
    }
  }, [audioSrc]); // Removed volume from dependencies to prevent reload on volume change
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  useEffect(() => {
    // Update audio element's volume when volume state changes
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (duration === 0 && audio.readyState < 2) {
        // If duration is not yet loaded, try to load it first
        audio.load();
      }
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && !isNaN(duration) && duration > 0) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // If unmuting and volume was 0, set to a default volume (e.g., 0.5)
    if (isMuted && volume === 0) {
      setVolume(0.5);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return isNaN(minutes) || isNaN(parseInt(seconds)) ? "0:00" : `${minutes}:${seconds}`;
  };
  
  // Display remaining time or total duration if paused/not started
  const displayTime = isPlaying ? duration - currentTime : duration;

  return (
    <div className="w-full p-3 bg-muted/50 rounded-lg shadow space-y-3">
      <audio ref={audioRef} src={audioSrc} preload="metadata"></audio>
      <div className="flex items-center gap-3">
        <Button onClick={togglePlayPause} variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <div className="flex-grow flex items-center gap-2">
          <Slider
            value={[currentTime]}
            // Use 1 as max if duration is 0 or NaN to prevent errors and show an empty bar
            max={duration > 0 && !isNaN(duration) ? duration : 1} 
            step={0.1} // Finer step for smoother progress
            onValueChange={handleTimeSliderChange}
            className="flex-grow [&_[role=slider]]:bg-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4"
            aria-label="Audio progress"
            disabled={duration === 0 || isNaN(duration)} // Disable slider if duration is not available
          />
          {/* Show remaining time, or total duration if paused at the start or duration not loaded */}
          <span className="text-sm text-muted-foreground w-12 text-right"> {/* Added fixed width and text-right */}
            {formatTime(displayTime)}
          </span>
        </div>
         <Button onClick={toggleMute} variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <div className="w-20">
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
}
