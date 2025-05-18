
import { Content } from "@/services/juriflix";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ContentDetail from "./ContentDetail";

interface ContentCardProps {
  content: Content;
  className?: string;
}

const ContentCard = ({ content, className }: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
                {content.nota && (
                  <div className="flex items-center">
                    <span>•</span>
                    <Star className="h-3 w-3 ml-1 text-yellow-500" />
                    <span>{content.nota}</span>
                  </div>
                )}
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
        <DialogContent className="max-w-4xl p-0 bg-netflix-dark border-netflix-gray overflow-hidden">
          <ContentDetail content={content} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
