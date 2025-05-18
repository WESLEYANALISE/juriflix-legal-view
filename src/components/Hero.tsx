
import { Content } from "@/services/juriflix";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeroProps {
  content: Content;
}

const Hero = ({ content }: HeroProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  // Extract YouTube ID from URL if it's a full URL
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already just an ID, use it directly
    if (!url.includes('/') && !url.includes('.')) {
      return `https://www.youtube.com/embed/${url}`;
    }
    
    // Try to extract ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="relative h-[70vh] md:h-[95vh] w-full">
      <div className="absolute inset-0">
        <img 
          src={content.capa} 
          alt={content.nome} 
          className="object-cover w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-netflix-black/30"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20 space-y-4 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-netflix-white">{content.nome}</h1>
        <div className="flex items-center space-x-2 text-sm text-netflix-white/70">
          <span>{content.ano}</span>
          <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
          <span className="capitalize">{content.tipo}</span>
          {content.nota && (
            <>
              <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
              <span>Nota: {content.nota}</span>
            </>
          )}
        </div>
        <p className="text-netflix-white/90 max-w-xl line-clamp-3 md:line-clamp-4">
          {content.sinopse}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
          <Button 
            onClick={() => window.open(content.link, "_blank")}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white"
          >
            Assistir no {content.plataforma}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setTrailerOpen(true)}
            className="bg-netflix-gray/80 text-white hover:bg-netflix-gray border-netflix-gray/50"
          >
            <Play size={16} className="mr-2" /> Ver Trailer
          </Button>
        </div>
      </div>

      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="max-w-3xl p-0 bg-netflix-black border-netflix-gray">
          <div className="aspect-video w-full">
            <iframe 
              src={`${getYoutubeEmbedUrl(content.trailer)}?autoplay=1`} 
              className="w-full h-full" 
              title={`${content.nome} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hero;
