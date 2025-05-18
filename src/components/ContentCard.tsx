
import { Content } from "@/services/juriflix";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: Content;
  className?: string;
}

const ContentCard = ({ content, className }: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
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
    <>
      <div 
        className={cn(
          "relative group transition-all duration-200 cursor-pointer rounded-md overflow-hidden",
          isHovered ? "scale-105 z-10 shadow-xl" : "scale-100",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setDetailsOpen(true)}
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img 
            src={content.capa} 
            alt={content.nome} 
            className={cn(
              "object-cover w-full h-full transition-transform duration-300",
              isHovered ? "scale-110 opacity-50" : "scale-100"
            )}
          />
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/70 to-transparent flex flex-col justify-end p-3 animate-fade-in">
            <h3 className="text-netflix-white font-semibold text-sm line-clamp-1">{content.nome}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1 text-xs text-netflix-white/70">
                <span>{content.ano}</span>
                <span className="capitalize">{content.tipo}</span>
              </div>
              <Button 
                size="icon"
                variant="outline"
                className="h-6 w-6 rounded-full bg-netflix-red border-none hover:bg-netflix-red/90"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsOpen(true);
                }}
              >
                <Play className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl p-0 bg-netflix-dark border-netflix-gray overflow-hidden">
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden">
              <iframe 
                src={getYoutubeEmbedUrl(content.trailer)} 
                className="w-full h-full" 
                title={`${content.nome} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-netflix-white">{content.nome}</h2>
                  <div className="flex items-center space-x-2 text-sm text-netflix-white/70 mt-1">
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
                </div>
                
                <Button 
                  onClick={() => window.open(content.link, "_blank")}
                  className="bg-netflix-red hover:bg-netflix-red/80 text-white"
                >
                  {content.plataforma}
                </Button>
              </div>
              
              <p className="text-netflix-white/90">{content.sinopse}</p>
              
              {content.beneficios && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-netflix-white mb-2">Benefícios para Estudantes de Direito:</h3>
                  <p className="text-netflix-white/90">{content.beneficios}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
