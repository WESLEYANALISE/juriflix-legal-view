import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Content } from '@/services/juriflix';

interface VideoPlayerProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
}

// Função para converter link do Google Drive para streaming direto
const convertGoogleDriveUrl = (url: string) => {
  if (!url || !url.includes('drive.google.com')) return url;
  
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return url;
};

const VideoPlayer = ({ content, isOpen, onClose }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Carrega progresso salvo do usuário
  useEffect(() => {
    if (isOpen && content.id) {
      loadUserProgress();
    }
  }, [isOpen, content.id]);

  const loadUserProgress = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data } = await supabase
        .from('video_progress')
        .select('progress_seconds, progress_percentage')
        .eq('user_id', user.user.id)
        .eq('content_id', content.id)
        .maybeSingle();

      if (data && data.progress_seconds > 0 && videoRef.current) {
        videoRef.current.currentTime = data.progress_seconds;
        setCurrentTime(data.progress_seconds);
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user || !videoRef.current) return;

      const video = videoRef.current;
      const progressPercentage = duration > 0 ? (video.currentTime / duration) : 0;

      await supabase.from('video_progress').upsert({
        user_id: user.user.id,
        content_id: content.id,
        content_title: content.nome,
        progress_seconds: video.currentTime,
        progress_percentage: progressPercentage,
        duration_seconds: duration,
        last_watched: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Salva progresso a cada 10 segundos
      if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
        saveProgress();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
      showControlsTemporarily();
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
      // Força orientação landscape no mobile se disponível
      try {
        if ('screen' in window && 'orientation' in screen) {
          const orientation = screen.orientation as any;
          if (orientation && orientation.lock) {
            orientation.lock('landscape').catch(() => {});
          }
        }
      } catch (error) {
        console.log('Orientation lock not supported');
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const videoUrl = content.linkVideo ? convertGoogleDriveUrl(content.linkVideo) : '';

  if (!videoUrl) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-0 bg-black border-none">
        <div 
          ref={containerRef}
          className={`relative bg-black ${fullscreen ? 'h-screen w-screen' : 'aspect-video'}`}
          onMouseMove={showControlsTemporarily}
          onTouchStart={showControlsTemporarily}
        >
          <DialogClose className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2">
            <X className="h-6 w-6" />
          </DialogClose>

          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              saveProgress();
            }}
            onClick={handlePlayPause}
          />

          {/* Controles customizados */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Título do vídeo */}
            <div className="absolute top-4 left-4 text-white">
              <h2 className="text-xl font-bold">{content.nome}</h2>
              <p className="text-sm text-white/80">{content.ano} • {content.tipo}</p>
            </div>

            {/* Botão play/pause central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>

            {/* Controles inferiores */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Barra de progresso */}
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm min-w-[50px]">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={1}
                  value={currentTime}
                  onChange={handleSeekChange}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-white text-sm min-w-[50px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controles de ação */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">
                    {Math.round(progressPercentage * 100)}% assistido
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;