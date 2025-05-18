
import React from "react";
import { Content } from "@/services/juriflix";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ContentDetail from "@/components/ContentDetail";
import { StarIcon } from "lucide-react";

interface ContentListProps {
  title: string;
  contents: Content[];
}

const ContentList = ({ title, contents }: ContentListProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-netflix-white text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-netflix-dark rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-netflix-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-netflix-white">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-netflix-white hidden md:table-cell">Ano</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-netflix-white hidden md:table-cell">Avaliação</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-netflix-white">Plataforma</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content, index) => (
              <Dialog key={content.id}>
                <DialogTrigger asChild>
                  <tr 
                    className={`hover:bg-netflix-gray/30 cursor-pointer border-b border-netflix-gray/20 ${
                      index % 2 === 0 ? "bg-netflix-dark" : "bg-netflix-black/30"
                    }`}
                  >
                    <td className="px-4 py-3 text-netflix-white flex items-center gap-3">
                      <img 
                        src={content.capa} 
                        alt={content.nome} 
                        className="w-10 h-14 object-cover rounded"
                      />
                      <span className="font-medium">{content.nome}</span>
                    </td>
                    <td className="px-4 py-3 text-netflix-lightGray hidden md:table-cell">{content.ano}</td>
                    <td className="px-4 py-3 text-netflix-lightGray hidden md:table-cell">
                      {content.nota && (
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{content.nota}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-netflix-lightGray">{content.plataforma}</td>
                  </tr>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-4xl bg-netflix-black border-netflix-gray">
                  <ContentDetail content={content} />
                </DialogContent>
              </Dialog>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentList;
