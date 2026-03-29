import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { INITIAL_ARTISTS, INITIAL_SONGS } from "../data/sampleData";
import type { Artist, Playlist, Song, ViewType } from "../types";

const STORAGE_KEY = "surSangeet_data";

interface MusicState {
  artists: Artist[];
  songs: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentView: ViewType;
  selectedArtistId: string | null;
  selectedPlaylistId: string | null;
  isShuffle: boolean;
  isRepeat: boolean;
  queue: Song[];
  isAdminLoggedIn: boolean;
  searchQuery: string;
}

interface MusicContextType extends MusicState {
  setCurrentView: (view: ViewType) => void;
  setSelectedArtistId: (id: string | null) => void;
  setSelectedPlaylistId: (id: string | null) => void;
  playSong: (song: Song, queue?: Song[]) => void;
  pauseResume: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (v: number) => void;
  setProgress: (p: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addArtist: (artist: Omit<Artist, "id">) => void;
  updateArtist: (artist: Artist) => void;
  deleteArtist: (id: string) => void;
  addSong: (song: Omit<Song, "id" | "durationSeconds">) => void;
  updateSong: (song: Song) => void;
  deleteSong: (id: string) => void;
  setAdminLoggedIn: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
}

function loadFromStorage(): Partial<MusicState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function parseDuration(str: string): number {
  const [m, s] = str.split(":").map(Number);
  return m * 60 + (s || 0);
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const stored = loadFromStorage();

  const [artists, setArtists] = useState<Artist[]>(
    stored.artists ?? INITIAL_ARTISTS,
  );
  const [songs, setSongs] = useState<Song[]>(stored.songs ?? INITIAL_SONGS);
  const [playlists, setPlaylists] = useState<Playlist[]>(
    stored.playlists ?? [],
  );
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [currentView, setCurrentView] = useState<ViewType>("browse");
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isAdminLoggedIn, setAdminLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep a ref to the latest queue + currentSong for use inside interval without re-subscribing
  const queueRef = useRef(queue);
  const currentSongRef = useRef(currentSong);
  const isShuffleRef = useRef(isShuffle);
  const isRepeatRef = useRef(isRepeat);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);
  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);
  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  // Persist data
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ artists, songs, playlists }),
    );
  }, [artists, songs, playlists]);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgressState(0);
    if (newQueue) setQueue(newQueue);
  }, []);

  const playSongRef = useRef(playSong);
  useEffect(() => {
    playSongRef.current = playSong;
  }, [playSong]);

  // Progress simulation
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && currentSong) {
      intervalRef.current = setInterval(() => {
        setProgressState((prev) => {
          const song = currentSongRef.current;
          if (!song) return prev;
          const increment = 100 / song.durationSeconds;
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(intervalRef.current!);
            if (isRepeatRef.current) return 0;
            // Auto-advance
            const q = queueRef.current;
            const cur = currentSongRef.current;
            if (cur && q.length > 0) {
              const idx = q.findIndex((s) => s.id === cur.id);
              const nextIdx = isShuffleRef.current
                ? Math.floor(Math.random() * q.length)
                : (idx + 1) % q.length;
              setTimeout(() => playSongRef.current(q[nextIdx], q), 0);
            }
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentSong]);

  const pauseResume = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextSong = useCallback(() => {
    const cur = currentSongRef.current;
    const q = queueRef.current;
    if (!cur || q.length === 0) return;
    const idx = q.findIndex((s) => s.id === cur.id);
    const nextIdx = isShuffleRef.current
      ? Math.floor(Math.random() * q.length)
      : (idx + 1) % q.length;
    playSongRef.current(q[nextIdx], q);
  }, []);

  const prevSong = useCallback(() => {
    const cur = currentSongRef.current;
    const q = queueRef.current;
    if (!cur || q.length === 0) return;
    const idx = q.findIndex((s) => s.id === cur.id);
    const prevIdx = (idx - 1 + q.length) % q.length;
    playSongRef.current(q[prevIdx], q);
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);
  const setProgress = useCallback((p: number) => setProgressState(p), []);
  const toggleShuffle = useCallback(() => setIsShuffle((p) => !p), []);
  const toggleRepeat = useCallback(() => setIsRepeat((p) => !p), []);

  const createPlaylist = useCallback((name: string) => {
    setPlaylists((prev) => [
      ...prev,
      { id: Date.now().toString(), name, songIds: [], createdAt: Date.now() },
    ]);
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addSongToPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId && !p.songIds.includes(songId)
            ? { ...p, songIds: [...p.songIds, songId] }
            : p,
        ),
      );
    },
    [],
  );

  const removeSongFromPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId
            ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
            : p,
        ),
      );
    },
    [],
  );

  const addArtist = useCallback((artist: Omit<Artist, "id">) => {
    setArtists((prev) => [...prev, { ...artist, id: Date.now().toString() }]);
  }, []);

  const updateArtist = useCallback((artist: Artist) => {
    setArtists((prev) => prev.map((a) => (a.id === artist.id ? artist : a)));
  }, []);

  const deleteArtist = useCallback((id: string) => {
    setArtists((prev) => prev.filter((a) => a.id !== id));
    setSongs((prev) => prev.filter((s) => s.artistId !== id));
  }, []);

  const addSong = useCallback((song: Omit<Song, "id" | "durationSeconds">) => {
    setSongs((prev) => [
      ...prev,
      {
        ...song,
        id: Date.now().toString(),
        durationSeconds: parseDuration(song.duration),
      },
    ]);
  }, []);

  const updateSong = useCallback((song: Song) => {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === song.id
          ? { ...song, durationSeconds: parseDuration(song.duration) }
          : s,
      ),
    );
  }, []);

  const deleteSong = useCallback((id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    setPlaylists((prev) =>
      prev.map((p) => ({
        ...p,
        songIds: p.songIds.filter((sid) => sid !== id),
      })),
    );
  }, []);

  const value: MusicContextType = {
    artists,
    songs,
    playlists,
    currentSong,
    isPlaying,
    progress,
    volume,
    currentView,
    selectedArtistId,
    selectedPlaylistId,
    isShuffle,
    isRepeat,
    queue,
    isAdminLoggedIn,
    searchQuery,
    setCurrentView,
    setSelectedArtistId,
    setSelectedPlaylistId,
    playSong,
    pauseResume,
    nextSong,
    prevSong,
    setVolume,
    setProgress,
    toggleShuffle,
    toggleRepeat,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    addArtist,
    updateArtist,
    deleteArtist,
    addSong,
    updateSong,
    deleteSong,
    setAdminLoggedIn,
    setSearchQuery,
  };

  return (
    <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
