import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { Content, getAllContent, getContentByType } from "@/services/juriflix";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ContentList from "@/components/ContentList";
const Index = () => {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [documentaries, setDocumentaries] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"nome" | "nota" | "ano" | "plataforma">("nome");
  const {
    toast
  } = useToast();
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Get all types of content with correct casing as stored in the database
        const movieData = await getContentByType('Filme');
        const seriesData = await getContentByType('Séries');
        const documentaryData = await getContentByType('Documentários');

        // Randomize data order on each app access
        setMovies(shuffleArray([...movieData]));
        setSeries(shuffleArray([...seriesData]));
        setDocumentaries(shuffleArray([...documentaryData]));

        // Set a featured content randomly from all content
        const allContent = [...movieData, ...seriesData, ...documentaryData];
        if (allContent.length > 0) {
          const randomIndex = Math.floor(Math.random() * allContent.length);
          setFeaturedContent(allContent[randomIndex]);
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

  // Helper function to shuffle array for random display order
  const shuffleArray = (array: Content[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Filter and sort content based on search query and sort option
  const filterContent = (content: Content[]) => {
    let filtered = content;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.nome.toLowerCase().includes(query) || item.sinopse?.toLowerCase().includes(query) || item.plataforma?.toLowerCase().includes(query));
    }

    // Sort content
    return [...filtered].sort((a, b) => {
      if (sortBy === "nota") {
        const notaA = parseFloat(a.nota) || 0;
        const notaB = parseFloat(b.nota) || 0;
        return notaB - notaA;
      } else if (sortBy === "ano") {
        return (b.ano || "").localeCompare(a.ano || "");
      } else if (sortBy === "plataforma") {
        return (a.plataforma || "").localeCompare(b.plataforma || "");
      } else {
        // Default sort by name
        return (a.nome || "").localeCompare(b.nome || "");
      }
    });
  };
  const filteredMovies = filterContent(movies);
  const filteredSeries = filterContent(series);
  const filteredDocumentaries = filterContent(documentaries);
  return <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Section */}
      {featuredContent && <Hero content={featuredContent} />}
      
      {/* Search and Filter Controls */}
      <div className="px-4 md:px-10 pt-4 md:pt-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Pesquisar conteúdo..." className="pl-8 bg-netflix-dark border-netflix-gray text-netflix-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        
        <div className="flex gap-2 items-center">
          <span className="text-netflix-white text-sm mr-1">Ordenar por:</span>
          <select className="bg-netflix-dark text-netflix-white border border-netflix-gray rounded px-2 py-1 text-sm" value={sortBy} onChange={e => setSortBy(e.target.value as "nome" | "nota" | "ano" | "plataforma")}>
            <option value="nome">Nome</option>
            <option value="nota">Mais avaliados</option>
            <option value="ano">Ano</option>
            <option value="plataforma">Plataforma</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button variant={viewMode === 'grid' ? "default" : "outline"} onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? "bg-netflix-red" : "border-netflix-gray text-netflix-white"} size="sm">
            Grade
          </Button>
          <Button variant={viewMode === 'list' ? "default" : "outline"} onClick={() => setViewMode('list')} className={viewMode === 'list' ? "bg-netflix-red" : "border-netflix-gray text-netflix-white"} size="sm">
            Lista
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-4 md:mt-8 pb-16 md:px-10 px-0">
        {isLoading ? <div className="flex justify-center items-center h-40">
            <p className="text-netflix-white">Carregando conteúdo...</p>
          </div> : <>
            {viewMode === 'grid' ? <>
                {filteredMovies.length > 0 && <ContentRow title="Filmes Jurídicos" contents={filteredMovies} />}
                {filteredSeries.length > 0 && <ContentRow title="Séries Jurídicas" contents={filteredSeries} />}
                {filteredDocumentaries.length > 0 && <ContentRow title="Documentários Jurídicos" contents={filteredDocumentaries} />}
              </> : <div className="space-y-8">
                {filteredMovies.length > 0 && <ContentList title="Filmes Jurídicos" contents={filteredMovies} />}
                {filteredSeries.length > 0 && <ContentList title="Séries Jurídicas" contents={filteredSeries} />}
                {filteredDocumentaries.length > 0 && <ContentList title="Documentários Jurídicos" contents={filteredDocumentaries} />}
              </div>}
          </>}
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-10 text-netflix-lightGray text-sm text-center border-t border-netflix-gray/30">
        <p>© 2023 Juriflix. Todos os direitos reservados.</p>
      </footer>
    </div>;
};
export default Index;