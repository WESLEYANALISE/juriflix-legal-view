import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
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
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const playerRef = useRef<ReactPlayer>(null);
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
        .single();

      if (data && data.progress_percentage > 0.05) {
        setPlayed(data.progress_percentage);
        if (playerRef.current) {
          playerRef.current.seekTo(data.progress_percentage);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  const saveProgress = async (playedSeconds: number, playedFraction: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase.from('video_progress').upsert({
        user_id: user.user.id,
        content_id: content.id,
        content_title: content.nome,
        progress_seconds: playedSeconds,
        progress_percentage: playedFraction,
        duration_seconds: duration,
        last_watched: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    setLoaded(state.loaded);
    
    // Salva progresso a cada 10 segundos
    if (Math.floor(state.playedSeconds) % 10 === 0) {
      saveProgress(state.playedSeconds, state.played);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    showControlsTemporarily();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
      // Força orientação landscape no mobile
      if (screen.orientation) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } else {
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

          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            onDuration={setDuration}
            onEnded={() => {
              setPlaying(false);
              saveProgress(duration, 1);
            }}
            controls={false}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous'
                }
              }
            }}
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
                  {formatTime(played * duration)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={played}
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
                    {Math.round(played * 100)}% assistido
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