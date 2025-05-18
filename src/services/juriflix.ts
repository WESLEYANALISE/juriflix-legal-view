
import { supabase } from "@/integrations/supabase/client";

export interface Content {
  id: number;
  tipo: string;
  nome: string;
  ano: string;
  sinopse: string;
  nota: string;
  plataforma: string;
  capa: string;
  beneficios: string;
  link: string;
  trailer: string;
}

export async function getAllContent(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('juriflix')
    .select('*')
    .order('nome');

  if (error) {
    console.error("Error fetching content:", error);
    return [];
  }

  return data || [];
}

export async function getContentByType(type: string): Promise<Content[]> {
  const { data, error } = await supabase
    .from('juriflix')
    .select('*')
    .eq('tipo', type)
    .order('nome');

  if (error) {
    console.error(`Error fetching ${type} content:`, error);
    return [];
  }

  return data || [];
}

export function getFeaturedContent(): Content[] {
  // This is a placeholder that will be replaced with real data
  // when we fetch from Supabase
  return [];
}
