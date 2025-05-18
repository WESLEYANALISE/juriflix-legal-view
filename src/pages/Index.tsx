
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { Content, getAllContent, getContentByType } from "@/services/juriflix";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [documentaries, setDocumentaries] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Get all types of content
        const movieData = await getContentByType('filme');
        const seriesData = await getContentByType('serie');
        const documentaryData = await getContentByType('documentario');
        
        setMovies(movieData);
        setSeries(seriesData);
        setDocumentaries(documentaryData);
        
        // Set a featured content (first movie or any content)
        if (movieData.length > 0) {
          setFeaturedContent(movieData[0]);
        } else if (seriesData.length > 0) {
          setFeaturedContent(seriesData[0]);
        } else if (documentaryData.length > 0) {
          setFeaturedContent(documentaryData[0]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o conteúdo. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Section */}
      {featuredContent && <Hero content={featuredContent} />}
      
      {/* Content Rows */}
      <div className="mt-4 md:mt-8 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-netflix-white">Carregando conteúdo...</p>
          </div>
        ) : (
          <>
            {movies.length > 0 && <ContentRow title="Filmes Jurídicos" contents={movies} />}
            {series.length > 0 && <ContentRow title="Séries Jurídicas" contents={series} />}
            {documentaries.length > 0 && <ContentRow title="Documentários Jurídicos" contents={documentaries} />}
          </>
        )}
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-10 text-netflix-lightGray text-sm text-center border-t border-netflix-gray/30">
        <p>© 2023 Juriflix. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
