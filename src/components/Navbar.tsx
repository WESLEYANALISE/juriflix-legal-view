
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Film, Video, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed w-full z-50 transition-all duration-500 ease-in-out px-4 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between",
        isScrolled ? "bg-netflix-black/95 shadow-md" : "bg-gradient-to-b from-netflix-black/90 to-transparent"
      )}
    >
      <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
        <Link to="/" className="flex items-center space-x-2">
          <Play size={30} className="text-netflix-red" />
          <h1 className="text-netflix-red text-2xl font-bold tracking-tighter">JURIFLIX</h1>
        </Link>
      </div>

      <div className={cn(
        "flex flex-row w-full md:w-auto justify-between",
        isMobile ? "order-first mb-3" : ""
      )}>
        <div className="flex items-center space-x-4 text-sm">
          <Link to="/" className="text-netflix-white hover:text-netflix-red transition-colors">
            Início
          </Link>
          <Link to="/filmes" className="text-netflix-white hover:text-netflix-red transition-colors flex items-center">
            <Film size={16} className="mr-1" />
            Filmes
          </Link>
          <Link to="/series" className="text-netflix-white hover:text-netflix-red transition-colors flex items-center">
            <Video size={16} className="mr-1" />
            Séries
          </Link>
          <Link to="/documentarios" className="text-netflix-white hover:text-netflix-red transition-colors">
            Documentários
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-netflix-white hover:text-netflix-red">
              Pesquisar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
