import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Movie = {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  trailer_url: string;
  release_year: number;
  duration: number;
  genre: string[];
  rating: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type MovieVideo = {
  id: string;
  movie_id: string;
  quality: string;
  video_url: string;
  file_size: string;
  created_at: string;
};

export type Series = {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  release_year: number;
  genre: string[];
  rating: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Episode = {
  id: string;
  series_id: string;
  season_number: number;
  episode_number: number;
  title: string;
  description: string;
  duration: number;
  thumbnail_url: string;
  created_at: string;
};

export type EpisodeVideo = {
  id: string;
  episode_id: string;
  quality: string;
  video_url: string;
  file_size: string;
  created_at: string;
};

export type Notification = {
  id: string;
  type: string;
  content_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
