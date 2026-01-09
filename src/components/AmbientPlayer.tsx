import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, X, SkipBack, SkipForward } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  url: string;
  duration: string;
}

interface AmbientPlayerProps {
  onClose?: () => void;
}

const TRACKS: Track[] = [
  { id: '1', name: 'Gregorian Chant', url: '', duration: '∞' },
  { id: '2', name: 'Rosary Meditation', url: '', duration: '∞' },
  { id: '3', name: 'Sacred Silence', url: '', duration: '∞' },
  { id: '4', name: 'Adoration', url: '', duration: '∞' },
  { id: '5', name: 'Ave Maria', url: '', duration: '∞' },
];

const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!currentTrack.url) {
      // Placeholder - no actual audio
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    selectTrack(TRACKS[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(TRACKS[prevIndex]);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="text-brand-violet" />
            Ambiente de Oração
          </h1>
          <p className="text-slate-400 text-sm mt-1">Músicas para meditação e contemplação</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Current Track */}
      <div className="bg-gradient-to-br from-brand-violet/20 to-purple-900/20 border border-brand-violet/30 rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-brand-violet/30 rounded-full flex items-center justify-center mb-4">
            <Music size={40} className={`text-brand-violet ${isPlaying ? 'animate-pulse' : ''}`} />
          </div>
          <h2 className="text-xl font-semibold">{currentTrack.name}</h2>
          <p className="text-slate-400 text-sm">{currentTrack.duration}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={prevTrack}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 bg-brand-violet hover:bg-brand-violet-dark rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={nextTrack}
            className="p-3 hover:bg-white/10 rounded-full transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 max-w-xs mx-auto">
          <button onClick={toggleMute} className="text-slate-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-violet [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Playlist</h3>
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => selectTrack(track)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
              currentTrack.id === track.id
                ? 'bg-brand-violet/20 border border-brand-violet/30'
                : 'bg-white/5 border border-white/10 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-lg ${currentTrack.id === track.id ? 'bg-brand-violet' : 'bg-white/10'}`}>
              <Music size={16} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">{track.name}</p>
            </div>
            <span className="text-sm text-slate-400">{track.duration}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center">
        💡 Use fones de ouvido para uma experiência de meditação mais profunda.
      </p>

      {currentTrack.url && <audio ref={audioRef} src={currentTrack.url} loop />}
    </div>
  );
};

export default AmbientPlayer;
