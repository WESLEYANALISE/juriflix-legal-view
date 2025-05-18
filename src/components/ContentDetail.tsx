
import { Content } from "@/services/juriflix";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
    <div className="flex flex-col md:flex-row p-6 bg-netflix-dark rounded-lg overflow-hidden">
      <div className="md:w-1/3 md:pr-6 mb-4 md:mb-0">
        <div className="aspect-[2/3] w-full rounded-md overflow-hidden">
          <img 
            src={content.capa} 
            alt={content.nome} 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      
      <div className="md:w-2/3 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-netflix-white">{content.nome}</h1>
        
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
        
        <p className="text-netflix-white/90">{content.sinopse}</p>
        
        {content.beneficios && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-netflix-white mb-1">Benefícios para Estudantes de Direito:</h3>
            <p className="text-netflix-white/90">{content.beneficios}</p>
          </div>
        )}
        
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

export default ContentDetail;
