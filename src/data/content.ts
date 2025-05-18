
export type ContentType = 'movie' | 'series' | 'documentary';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  coverImage: string;
  trailerUrl: string;
  synopsis: string;
  streamingUrl: string;
  streamingPlatform: string;
  year: number;
  categories: string[];
  featured?: boolean;
}

export const legalContent: Content[] = [
  {
    id: "1",
    title: "A 12ª Hora",
    type: "movie",
    coverImage: "https://source.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Um jovem advogado se vê envolvido em uma conspiração quando aceita defender um poderoso empresário acusado de crimes financeiros. Com apenas 12 horas para provar a inocência de seu cliente antes do julgamento final, ele descobre uma rede de corrupção que vai muito além do que imaginava.",
    streamingUrl: "https://netflix.com",
    streamingPlatform: "Netflix",
    year: 2022,
    categories: ["Drama Jurídico", "Suspense"],
    featured: true
  },
  {
    id: "2",
    title: "Tribunal Supremo",
    type: "series",
    coverImage: "https://source.unsplash.com/photo-1470813740244-df37b8c1edcb",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Acompanhe o cotidiano de cinco juízes do Supremo Tribunal Federal em uma série que revela os bastidores das decisões mais importantes do país. Entre dilemas morais, pressões políticas e ameaças pessoais, eles precisam manter a integridade do sistema judicial.",
    streamingUrl: "https://primevideo.com",
    streamingPlatform: "Prime Video",
    year: 2023,
    categories: ["Drama", "Político"],
    featured: true
  },
  {
    id: "3",
    title: "Código de Ética",
    type: "documentary",
    coverImage: "https://source.unsplash.com/photo-1500673922987-e212871fec22",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Este documentário investiga os dilemas éticos enfrentados por advogados em casos de grande repercussão. Através de entrevistas com profissionais renomados e análise de casos históricos, a produção questiona até onde vai o compromisso com a verdade face ao dever de defender o cliente.",
    streamingUrl: "https://globoplay.com",
    streamingPlatform: "GloboPlay",
    year: 2021,
    categories: ["Documentário", "Ética Jurídica"]
  },
  {
    id: "4",
    title: "Além da Lei",
    type: "movie",
    coverImage: "https://source.unsplash.com/photo-1523712999610-f77fbcfc3843",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Um promotor incorruptível busca justiça em um sistema corrompido por interesses políticos. Quando descobre provas contra um senador poderoso, precisa decidir entre seguir o protocolo legal ou usar métodos não convencionais para garantir que a justiça seja feita.",
    streamingUrl: "https://hbomax.com",
    streamingPlatform: "HBO Max",
    year: 2020,
    categories: ["Ação", "Drama Jurídico"]
  },
  {
    id: "5",
    title: "Jurisprudência",
    type: "series",
    coverImage: "https://source.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Uma série antológica que recria casos jurídicos históricos que mudaram a interpretação das leis no Brasil. Cada episódio aborda um caso emblemático e mostra como decisões judiciais do passado moldaram a sociedade atual.",
    streamingUrl: "https://disney.com",
    streamingPlatform: "Disney+",
    year: 2022,
    categories: ["Drama", "Histórico"]
  },
  {
    id: "6",
    title: "Carta Magna: A Constituição de 88",
    type: "documentary",
    coverImage: "https://source.unsplash.com/photo-1470813740244-df37b8c1edcb",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "O documentário explora o processo de elaboração da Constituição brasileira de 1988, com entrevistas exclusivas dos constituintes ainda vivos e análise do impacto das decisões tomadas naquele momento histórico no sistema jurídico brasileiro atual.",
    streamingUrl: "https://netflix.com",
    streamingPlatform: "Netflix",
    year: 2023,
    categories: ["Documentário", "História", "Política"]
  },
  {
    id: "7",
    title: "Defesa Máxima",
    type: "movie",
    coverImage: "https://source.unsplash.com/photo-1500673922987-e212871fec22",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Um prestigiado advogado criminalista aceita defender um amigo de infância acusado de assassinato, mesmo com todas as evidências apontando para sua culpa. À medida que o julgamento avança, segredos do passado vêm à tona, testando lealdades e a própria noção de justiça.",
    streamingUrl: "https://primevideo.com",
    streamingPlatform: "Prime Video",
    year: 2021,
    categories: ["Drama Jurídico", "Suspense"]
  },
  {
    id: "8",
    title: "Precedentes",
    type: "series",
    coverImage: "https://source.unsplash.com/photo-1523712999610-f77fbcfc3843",
    trailerUrl: "https://www.youtube.com/embed/dPmZqsQNzGA",
    synopsis: "Uma jovem juíza recém-empossada enfrenta dificuldades ao tentar estabelecer sua autoridade em uma comarca do interior. Entre casos peculiares e uma comunidade resistente a mudanças, ela precisa encontrar seu próprio estilo de aplicar a lei sem perder sua humanidade.",
    streamingUrl: "https://globoplay.com",
    streamingPlatform: "GloboPlay",
    year: 2020,
    categories: ["Drama", "Comédia"]
  }
];

// Helper functions for filtering content
export const getContentByType = (type: ContentType) => {
  return legalContent.filter(item => item.type === type);
};

export const getFeaturedContent = () => {
  return legalContent.filter(item => item.featured);
};

export const getContentById = (id: string) => {
  return legalContent.find(item => item.id === id);
};

export const getContentByCategory = (category: string) => {
  return legalContent.filter(item => item.categories.includes(category));
};
