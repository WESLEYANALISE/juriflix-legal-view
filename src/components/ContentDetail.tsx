
import { Content } from "@/services/juriflix";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

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
    <div className="relative bg-netflix-black rounded-lg">
      {/* Prominent Close Button - Made larger and more visible */}
      <DialogClose className="absolute right-2 top-2 z-50">
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10 rounded-full bg-netflix-black/80 border-netflix-gray hover:bg-netflix-red"
        >
          <X className="h-5 w-5 text-white" />
          <span className="sr-only">Fechar</span>
        </Button>
      </DialogClose>
      
      <div className="flex flex-col md:flex-row overflow-auto max-h-[80vh]">
        {/* Cover Image - Reduced size, removed sticky positioning */}
        <div className="md:w-1/4 p-4 flex-shrink-0">
          <div className="aspect-[2/3] w-full rounded-md overflow-hidden">
            <img 
              src={content.capa} 
              alt={content.nome} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Content Details - Expanded width */}
        <div className="md:w-3/4 p-4 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-netflix-white">{content.nome}</h1>
          
          <div className="flex items-center space-x-2 text-sm text-netflix-white/70 mt-2">
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
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button 
              onClick={() => window.open(content.link, "_blank")}
              className="bg-netflix-red hover:bg-netflix-red/80 text-white"
            >
              Assistir no {content.plataforma}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTrailerOpen(true)}
              className="bg-netflix-gray/60 text-white hover:bg-netflix-gray border-netflix-gray/50"
            >
              <Play size={16} className="mr-2" /> Ver Trailer
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-netflix-white mb-2">Sinopse</h3>
            <div className="text-netflix-white/90 max-h-32 md:max-h-none overflow-y-auto">
              {content.sinopse}
            </div>
          </div>
          
          {content.beneficios && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-netflix-white mb-2">Benefícios para Estudantes de Direito:</h3>
              <div className="text-netflix-white/90 max-h-32 md:max-h-none overflow-y-auto">
                {content.beneficios}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Trailer Dialog */}
      <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
        <DialogContent className="max-w-3xl p-0 bg-netflix-black border-netflix-gray">
          <div className="relative">
            <DialogClose className="absolute right-2 top-2 z-50">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-8 w-8 rounded-full bg-netflix-black/70 border-netflix-gray hover:bg-netflix-red"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </DialogClose>
            <div className="aspect-video w-full">
              <iframe 
                src={`${getYoutubeEmbedUrl(content.trailer)}?autoplay=1`} 
                className="w-full h-full" 
                title={`${content.nome} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentDetail;
