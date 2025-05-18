
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import ContentList from "@/components/ContentList";
import { Content, getAllContent, getContentByType } from "@/services/juriflix";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ListVideo, Grid, SortAsc } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [documentaries, setDocumentaries] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState<"nota" | "ano" | "plataforma">("nota");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Get all types of content with correct casing as stored in the database
        const movieData = await getContentByType('Filme');
        const seriesData = await getContentByType('Séries');
        const documentaryData = await getContentByType('Documentários');
        
        // Sort based on selected sort mode
        const sortFn = (a: Content, b: Content) => {
          if (sortMode === "nota") {
            return parseFloat(b.nota || "0") - parseFloat(a.nota || "0");
          } else if (sortMode === "ano") {
            return parseInt(b.ano || "0") - parseInt(a.ano || "0");
          } else if (sortMode === "plataforma") {
            return (a.plataforma || "").localeCompare(b.plataforma || "");
          }
          return 0;
        };
        
        setMovies([...movieData].sort(sortFn));
        setSeries([...seriesData].sort(sortFn));
        setDocumentaries([...documentaryData].sort(sortFn));
        
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
  }, [toast, sortMode]);

  // Re-sort data when sort mode changes
  const handleSortChange = (value: string) => {
    setSortMode(value as "nota" | "ano" | "plataforma");
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Section */}
      {featuredContent && <Hero content={featuredContent} />}
      
      {/* View Controls */}
      <div className="flex items-center justify-between px-4 md:px-10 mt-8 mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="text-netflix-white"
          >
            <Grid size={18} className="mr-1" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="text-netflix-white"
          >
            <ListVideo size={18} className="mr-1" /> Lista
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-netflix-white text-sm">Ordenar por:</span>
          <Select defaultValue={sortMode} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[130px] bg-netflix-dark text-netflix-white border-netflix-gray">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-netflix-dark text-netflix-white border-netflix-gray">
              <SelectItem value="nota">Avaliação</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
              <SelectItem value="plataforma">Streaming</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Content Rows */}
      <div className="mt-4 md:mt-8 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-netflix-white">Carregando conteúdo...</p>
          </div>
        ) : (
          <>
            {movies.length > 0 && viewMode === "grid" && <ContentRow title="Filmes Jurídicos" contents={movies} />}
            {movies.length > 0 && viewMode === "list" && <ContentList title="Filmes Jurídicos" contents={movies} />}
            
            {series.length > 0 && viewMode === "grid" && <ContentRow title="Séries Jurídicas" contents={series} />}
            {series.length > 0 && viewMode === "list" && <ContentList title="Séries Jurídicas" contents={series} />}
            
            {documentaries.length > 0 && viewMode === "grid" && <ContentRow title="Documentários Jurídicos" contents={documentaries} />}
            {documentaries.length > 0 && viewMode === "list" && <ContentList title="Documentários Jurídicos" contents={documentaries} />}
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
