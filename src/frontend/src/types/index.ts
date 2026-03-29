export interface Artist {
  id: string;
  name: string;
  language: "Hindi" | "Punjabi";
  bio: string;
  gradientClass: string;
  initials: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  year: number;
  duration: string; // "4:22"
  durationSeconds: number;
  genre: string;
  gradientClass: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

export type ViewType = "browse" | "artist" | "search" | "playlists" | "admin";
