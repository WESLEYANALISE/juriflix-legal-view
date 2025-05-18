
import { Content } from "@/data/content";
import ContentCard from "./ContentCard";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentRowProps {
  title: string;
  contents: Content[];
}

const ContentRow = ({ title, contents }: ContentRowProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollAmount = 800;

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const newScrollLeft = direction === 'left' 
        ? scrollLeft - scrollAmount 
        : scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative px-4 md:px-10 mb-8">
      <h2 className="text-netflix-white text-xl font-bold mb-4">{title}</h2>
      
      <div className="relative group">
        {showLeftArrow && (
          <Button
            onClick={() => scroll('left')}
            className="absolute left-0 z-10 top-1/2 -translate-y-1/2 w-10 h-20 bg-netflix-black/50 hover:bg-netflix-black/80 rounded-r-md"
          >
            <ArrowLeft className="text-netflix-white" />
          </Button>
        )}

        <div 
          className="flex overflow-x-auto space-x-4 no-scrollbar scroll-smooth"
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {contents.map((content) => (
            <div key={content.id} className="flex-shrink-0 w-[180px] md:w-[240px]">
              <ContentCard content={content} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            onClick={() => scroll('right')}
            className={cn(
              "absolute right-0 z-10 top-1/2 -translate-y-1/2 w-10 h-20 bg-netflix-black/50 hover:bg-netflix-black/80 rounded-l-md"
            )}
          >
            <ArrowRight className="text-netflix-white" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
