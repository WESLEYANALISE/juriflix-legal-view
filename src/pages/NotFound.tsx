
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-netflix-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-netflix-red text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Ops! Este conteúdo não foi encontrado.</p>
      <p className="mb-8 text-netflix-lightGray text-center max-w-md">
        A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
      </p>
      <Button asChild className="bg-netflix-red hover:bg-netflix-red/80 text-white">
        <Link to="/">Voltar para a Página Inicial</Link>
      </Button>
    </div>
  );
};

export default NotFound;
