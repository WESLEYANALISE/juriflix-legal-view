
import { Content } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HeroProps {
  content: Content;
}

const Hero = ({ content }: HeroProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <div className="relative h-[70vh] md:h-[95vh] w-full">
      <div className="absolute inset-0">
        <img 
          src={content.coverImage} 
          alt={content.title} 
          className="object-cover w-full h-full"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-netflix-black/30"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20 space-y-4 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-netflix-white">{content.title}</h1>
        <div className="flex items-center space-x-2 text-sm text-netflix-white/70">
          <span>{content.year}</span>
          <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
          <span className="capitalize">{content.type}</span>
          <span className="w-1 h-1 rounded-full bg-netflix-white/70"></span>
          <span>{content.categories.join(", ")}</span>
        </div>
        <p className="text-netflix-white/90 max-w-xl line-clamp-3 md:line-clamp-4">
          {content.synopsis}
        </p>
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

export default Hero;
