
import { Content } from "@/services/juriflix";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ContentDetail from "./ContentDetail";

interface ContentCardProps {
  content: Content;
  className?: string;
  viewMode?: "grid" | "list";
}

const ContentCard = ({ content, className, viewMode = "grid" }: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (viewMode === "list") {
    return (
      <>
        <div 
          className="flex bg-netflix-dark hover:bg-netflix-dark/70 rounded-md overflow-hidden cursor-pointer transition-colors"
          onClick={() => setDetailsOpen(true)}
        >
          <div className="w-[100px] h-[150px] flex-shrink-0">
            <img 
              src={content.capa} 
              alt={content.nome} 
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-netflix-white font-semibold mb-1">{content.nome}</h3>
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
              <p className="text-netflix-white/90 text-sm mt-2 line-clamp-2">{content.sinopse}</p>
            </div>
            
            <div className="flex items-center mt-3 space-x-2">
              <Button 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(content.link, "_blank");
                }}
                className="bg-netflix-red hover:bg-netflix-red/80 text-white text-xs"
              >
                {content.plataforma}
              </Button>
              
              <Button 
                size="sm"
                variant="outline"
                className="bg-netflix-gray/80 text-white hover:bg-netflix-gray border-netflix-gray/50 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsOpen(true);
                }}
              >
                <Play className="h-3 w-3 mr-1" /> Trailer
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-4xl p-0 bg-netflix-dark border-netflix-gray overflow-auto max-h-[90vh]">
            <ContentDetail content={content} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

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
        <DialogContent className="max-w-4xl p-0 bg-netflix-dark border-netflix-gray overflow-auto max-h-[90vh]">
          <ContentDetail content={content} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
