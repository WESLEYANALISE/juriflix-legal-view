
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import { getFeaturedContent, getContentByType } from "@/data/content";

const Index = () => {
  const featuredContent = getFeaturedContent()[0]; // Get the first featured content
  const movies = getContentByType('movie');
  const series = getContentByType('series');
  const documentaries = getContentByType('documentary');

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Section */}
      <Hero content={featuredContent} />
      
      {/* Content Rows */}
      <div className="mt-4 md:mt-8 pb-16">
        <ContentRow title="Filmes Jurídicos" contents={movies} />
        <ContentRow title="Séries Jurídicas" contents={series} />
        <ContentRow title="Documentários Jurídicos" contents={documentaries} />
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-10 text-netflix-lightGray text-sm text-center border-t border-netflix-gray/30">
        <p>© 2023 Juriflix. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
