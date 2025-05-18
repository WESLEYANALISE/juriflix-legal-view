
import { Content } from "@/data/content";
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
            src={content.coverImage} 
            alt={content.title} 
            className={cn(
              "object-cover w-full h-full transition-transform duration-300",
              isHovered ? "scale-110 opacity-50" : "scale-100"
            )}
          />
        </div>
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/70 to-transparent flex flex-col justify-end p-3 animate-fade-in">
            <h3 className="text-netflix-white font-semibold text-sm line-clamp-1">{content.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-1 text-xs text-netflix-white/70">
                <span>{content.year}</span>
                <span className="capitalize">{content.type}</span>
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
                src={content.trailerUrl} 
                className="w-full h-full" 
                title={`${content.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-netflix-white">{content.title}</h2>
                  <div className="flex items-center space-x-2 text-sm text-netflix-white/70 mt-1">
                    <span>{content.year}</span>
                    <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
                    <span className="capitalize">{content.type}</span>
                    <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
                    <span>{content.categories.join(", ")}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => window.open(content.streamingUrl, "_blank")}
                  className="bg-netflix-red hover:bg-netflix-red/80 text-white"
                >
                  {content.streamingPlatform}
                </Button>
              </div>
              
              <p className="text-netflix-white/90">{content.synopsis}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
