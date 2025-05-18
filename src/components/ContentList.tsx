
import { Content } from "@/services/juriflix";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, CalendarDays } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentDetail from "./ContentDetail";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ContentListProps {
  title: string;
  contents: Content[];
}

const ContentList = ({ title, contents }: ContentListProps) => {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  return (
    <div className="px-4 md:px-10 mb-8">
      <h2 className="text-netflix-white text-xl font-bold mb-4">{title}</h2>
      
      <div className="rounded-md overflow-hidden">
        <Table className="border border-netflix-gray/20">
          <TableHeader className="bg-netflix-dark">
            <TableRow>
              <TableHead className="text-netflix-white">Título</TableHead>
              <TableHead className="text-netflix-white w-24 hidden md:table-cell">Ano</TableHead>
              <TableHead className="text-netflix-white w-24 hidden md:table-cell">Nota</TableHead>
              <TableHead className="text-netflix-white w-32 hidden md:table-cell">Plataforma</TableHead>
              <TableHead className="text-netflix-white w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <TableRow 
                key={content.id} 
                className="hover:bg-netflix-dark/50 cursor-pointer border-t border-netflix-gray/20"
                onClick={() => setSelectedContent(content)}
              >
                <TableCell className="font-medium text-netflix-white">
                  <div className="flex items-center">
                    <img 
                      src={content.capa} 
                      alt={content.nome} 
                      className="w-10 h-14 mr-3 rounded object-cover hidden sm:block" 
                    />
                    <span>{content.nome}</span>
                  </div>
                </TableCell>
                <TableCell className="text-netflix-lightGray hidden md:table-cell">
                  <div className="flex items-center">
                    <CalendarDays size={14} className="mr-1" />
                    {content.ano}
                  </div>
                </TableCell>
                <TableCell className="text-netflix-lightGray hidden md:table-cell">
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-500 mr-1" />
                    {content.nota}
                  </div>
                </TableCell>
                <TableCell className="text-netflix-lightGray hidden md:table-cell">{content.plataforma}</TableCell>
                <TableCell>
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="bg-netflix-red/90 text-white border-none hover:bg-netflix-red"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedContent(content);
                    }}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Content Detail Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={(open) => !open && setSelectedContent(null)}>
        <DialogContent className="max-w-4xl p-0 bg-netflix-dark border-netflix-gray overflow-hidden">
          {selectedContent && <ContentDetail content={selectedContent} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentList;
