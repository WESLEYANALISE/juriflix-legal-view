
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { Content, getAllContent, getContentByType } from "@/services/juriflix";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search, List, Filter, Shuffle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [documentaries, setDocumentaries] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("random");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  // Function to shuffle array
  const shuffleArray = (array: Content[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Sort content based on criteria
  const sortContent = (content: Content[], order: string) => {
    if (order === "random") return shuffleArray(content);
    
    return [...content].sort((a, b) => {
      if (order === "rating-high") {
        const ratingA = parseFloat(a.nota) || 0;
        const ratingB = parseFloat(b.nota) || 0;
        return ratingB - ratingA;
      } 
      if (order === "rating-low") {
        const ratingA = parseFloat(a.nota) || 0;
        const ratingB = parseFloat(b.nota) || 0;
        return ratingA - ratingB;
      }
      // Default to name sorting
      return a.nome.localeCompare(b.nome);
    });
  };

  // Filter content based on search term
  const filterContent = (content: Content[]) => {
    if (!searchTerm) return content;
    
    return content.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sinopse.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Get all types of content with correct casing as stored in the database
        const movieData = await getContentByType('Filme');
        const seriesData = await getContentByType('Séries');
        const documentaryData = await getContentByType('Documentários');
        
        // Always shuffle data initially to randomize order on app load
        setMovies(shuffleArray(movieData));
        setSeries(shuffleArray(seriesData));
        setDocumentaries(shuffleArray(documentaryData));
        
        // Set a featured content (first movie or any content)
        if (movieData.length > 0) {
          setFeaturedContent(shuffleArray(movieData)[0]);
        } else if (seriesData.length > 0) {
          setFeaturedContent(shuffleArray(seriesData)[0]);
        } else if (documentaryData.length > 0) {
          setFeaturedContent(shuffleArray(documentaryData)[0]);
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

  // Re-sort when sort order changes
  useEffect(() => {
    if (!isLoading) {
      setMovies(prevMovies => sortContent(prevMovies, sortOrder));
      setSeries(prevSeries => sortContent(prevSeries, sortOrder));
      setDocumentaries(prevDocs => sortContent(prevDocs, sortOrder));
    }
  }, [sortOrder, isLoading]);

  const filteredMovies = filterContent(movies);
  const filteredSeries = filterContent(series);
  const filteredDocumentaries = filterContent(documentaries);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Section */}
      {featuredContent && <Hero content={featuredContent} />}
      
      {/* Search & Filters Bar */}
      <div className="px-4 md:px-10 py-4 bg-netflix-black/80 sticky top-0 z-10 flex flex-wrap gap-3 items-center border-b border-netflix-gray/30">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-netflix-lightGray h-4 w-4" />
          <Input
            className="pl-8 bg-netflix-dark border-netflix-gray text-netflix-white"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-36 bg-netflix-dark border-netflix-gray text-netflix-white">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Ordenar por" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-netflix-dark border-netflix-gray text-netflix-white">
              <SelectItem value="random"><div className="flex items-center gap-2"><Shuffle size={16} /> Aleatório</div></SelectItem>
              <SelectItem value="rating-high">Nota (Alta → Baixa)</SelectItem>
              <SelectItem value="rating-low">Nota (Baixa → Alta)</SelectItem>
              <SelectItem value="name">Nome (A → Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className={`h-10 w-10 p-0 ${viewMode === 'list' ? 'bg-netflix-red' : 'bg-netflix-dark'} border-netflix-gray text-netflix-white`}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <List className="h-4 w-4" />
          </Button>
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
            {filteredMovies.length > 0 && <ContentRow title="Filmes Jurídicos" contents={filteredMovies} viewMode={viewMode} />}
            {filteredSeries.length > 0 && <ContentRow title="Séries Jurídicas" contents={filteredSeries} viewMode={viewMode} />}
            {filteredDocumentaries.length > 0 && <ContentRow title="Documentários Jurídicos" contents={filteredDocumentaries} viewMode={viewMode} />}
            
            {filteredMovies.length === 0 && filteredSeries.length === 0 && filteredDocumentaries.length === 0 && (
              <div className="flex justify-center items-center h-40">
                <p className="text-netflix-white">Nenhum conteúdo encontrado para "{searchTerm}"</p>
              </div>
            )}
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
