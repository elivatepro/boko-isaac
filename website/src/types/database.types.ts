import { TeamMember } from "./projects";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          content: string | null;
          images: string[] | null;
          published_at: string | null;
          link: string | null;
          team: TeamMember[] | null;
          image: string | null;
          created_at: string | null;
          updated_at: string | null;
          display_order: number | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          content?: string | null;
          images?: string[] | null;
          published_at?: string | null;
          link?: string | null;
          team?: TeamMember[] | null;
          image?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string | null;
          content?: string | null;
          images?: string[] | null;
          published_at?: string | null;
          link?: string | null;
          team?: TeamMember[] | null;
          image?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
      };
      blogs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          summary: string | null;
          content: string | null;
          image: string | null;
          published_at: string | null;
          tag: string | null;
          created_at: string | null;
          updated_at: string | null;
          display_order: number | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          summary?: string | null;
          content?: string | null;
          image?: string | null;
          published_at?: string | null;
          tag?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          summary?: string | null;
          content?: string | null;
          image?: string | null;
          published_at?: string | null;
          tag?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          slug: string;
          name: string;
          role: string | null;
          company: string | null;
          content: string;
          rating: number;
          avatar: string | null;
          created_at: string | null;
          updated_at: string | null;
          display_order: number | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          role?: string | null;
          company?: string | null;
          content: string;
          rating?: number;
          avatar?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          role?: string | null;
          company?: string | null;
          content?: string;
          rating?: number;
          avatar?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          display_order?: number | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
