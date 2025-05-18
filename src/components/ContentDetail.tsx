
import { Content } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ContentDetailProps {
  content: Content;
}

const ContentDetail = ({ content }: ContentDetailProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row p-6 bg-netflix-dark rounded-lg overflow-hidden">
      <div className="md:w-1/3 md:pr-6 mb-4 md:mb-0">
        <div className="aspect-[2/3] w-full rounded-md overflow-hidden">
          <img 
            src={content.coverImage} 
            alt={content.title} 
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      
      <div className="md:w-2/3 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-netflix-white">{content.title}</h1>
        
        <div className="flex items-center space-x-2 text-sm text-netflix-white/70">
          <span>{content.year}</span>
          <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
          <span className="capitalize">{content.type}</span>
          <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
          <span>{content.categories.join(", ")}</span>
        </div>
        
        <p className="text-netflix-white/90">{content.synopsis}</p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
          <Button 
            onClick={() => window.open(content.streamingUrl, "_blank")}
            className="bg-netflix-red hover:bg-netflix-red/80 text-white"
          >
            Assistir no {content.streamingPlatform}
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
              src={`${content.trailerUrl}?autoplay=1`} 
              className="w-full h-full" 
              title={`${content.title} trailer`}
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
