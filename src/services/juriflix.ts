
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
  linkVideo?: string;
}

export async function getAllContent(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('Jurisflix')
    .select('*, "link Video" as linkVideo')
    .order('nome');

  if (error) {
    console.error("Error fetching content:", error);
    return [];
  }

  return data || [];
}

export async function getContentByType(type: string): Promise<Content[]> {
  const { data, error } = await supabase
    .from('Jurisflix')
    .select('*, "link Video" as linkVideo')
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
