
import { Content } from "@/services/juriflix";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContentDetailProps {
  content: Content;
}

const ContentDetail = ({ content }: ContentDetailProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  // Extract YouTube ID from URL
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
    <div className="flex flex-col md:flex-row bg-netflix-dark overflow-hidden">
      {/* Left Column - Image */}
      <div className="md:w-1/3 p-6">
        <div className="aspect-[2/3] w-full rounded-md overflow-hidden">
          <img 
            src={content.capa} 
            alt={content.nome} 
            className="object-cover w-full h-full"
          />
        </div>
        
        {/* Streaming Button - Now more visible and organized */}
        <div className="mt-4">
          <Button 
            onClick={() => window.open(content.link, "_blank")}
            className="w-full bg-netflix-red hover:bg-netflix-red/80 text-white px-6 py-6 text-lg font-medium"
          >
            <ExternalLink size={20} className="mr-2" />
            Assistir no {content.plataforma}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setTrailerOpen(true)}
          className="w-full mt-3 bg-netflix-gray/30 text-white hover:bg-netflix-gray border-netflix-gray/50"
        >
          <Play size={18} className="mr-2" /> Ver Trailer
        </Button>
      </div>
      
      {/* Right Column - Content Info */}
      <div className="md:w-2/3 p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-netflix-white">{content.nome}</h1>
        
        <div className="flex items-center space-x-2 text-sm text-netflix-white/70 mt-2 mb-4">
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
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-netflix-white mb-2">Sinopse</h3>
          {/* ScrollArea for long synopsis text */}
          <ScrollArea className="h-[200px] rounded-md border border-netflix-gray/20 p-4">
            <p className="text-netflix-white/90">{content.sinopse}</p>
          </ScrollArea>
        </div>
        
        {content.beneficios && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-netflix-white mb-2">Benefícios para Estudantes de Direito:</h3>
            <ScrollArea className="h-[150px] rounded-md border border-netflix-gray/20 p-4">
              <p className="text-netflix-white/90">{content.beneficios}</p>
            </ScrollArea>
          </div>
        )}
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

export default ContentDetail;
