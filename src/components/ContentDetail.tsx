
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
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [showFullBenefits, setShowFullBenefits] = useState(false);
  
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

  // Function to check if text is long enough to need "ver mais"
  const isTextLong = (text: string) => text && text.length > 180;

  return (
    <div className="relative bg-netflix-dark text-netflix-white">
      <DialogClose className="absolute top-3 right-3 z-10 bg-netflix-black/70 hover:bg-netflix-red rounded-full p-1">
        <X className="h-6 w-6" />
        <span className="sr-only">Fechar</span>
      </DialogClose>
      
      <div className="grid md:grid-cols-3 gap-4">
        {/* Thumbnail column */}
        <div className="p-4 md:p-6">
          <div className="aspect-[2/3] w-full max-w-[250px] mx-auto rounded-md overflow-hidden">
            <img 
              src={content.capa} 
              alt={content.nome} 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        
        {/* Content column */}
        <div className="md:col-span-2 p-4 md:p-6 pt-0 md:pt-6">
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
          
          {/* Sinopse with "ver mais" button */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-netflix-white mb-1">Sinopse</h3>
            <div className="text-netflix-white/90 relative">
              <p className={isTextLong(content.sinopse) && !showFullSynopsis ? "line-clamp-3" : ""}>
                {content.sinopse}
              </p>
              {isTextLong(content.sinopse) && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-netflix-red p-0 h-auto mt-1"
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                >
                  {showFullSynopsis ? "Ver menos" : "Ver mais"}
                </Button>
              )}
            </div>
          </div>
          
          {/* Benefícios with "ver mais" button */}
          {content.beneficios && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-netflix-white mb-1">Benefícios para Estudantes de Direito</h3>
              <div className="text-netflix-white/90">
                <p className={isTextLong(content.beneficios) && !showFullBenefits ? "line-clamp-3" : ""}>
                  {content.beneficios}
                </p>
                {isTextLong(content.beneficios) && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-netflix-red p-0 h-auto mt-1"
                    onClick={() => setShowFullBenefits(!showFullBenefits)}
                  >
                    {showFullBenefits ? "Ver menos" : "Ver mais"}
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mt-6">
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
