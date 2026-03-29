import { Input } from "@/components/ui/input";
import { Music, Search, Users } from "lucide-react";
import { SongRow } from "../components/SongRow";
import { useMusic } from "../context/MusicContext";

export function SearchView() {
  const {
    searchQuery,
    setSearchQuery,
    artists,
    songs,
    setCurrentView,
    setSelectedArtistId,
  } = useMusic();

  const q = searchQuery.toLowerCase().trim();
  const matchedArtists = q
    ? artists.filter((a) => a.name.toLowerCase().includes(q))
    : [];
  const matchedSongs = q
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artistName.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q),
      )
    : [];

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-black uppercase tracking-tight text-foreground mb-6">
        Search
      </h1>

      <div className="relative mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="search.search_input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, genres…"
          className="pl-10 py-5 text-base bg-card border-border focus:border-music-magenta"
          autoFocus
        />
      </div>

      {!q && (
        <div className="text-center py-20" data-ocid="search.empty_state">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Type to search for songs or artists
          </p>
        </div>
      )}

      {q && matchedArtists.length === 0 && matchedSongs.length === 0 && (
        <div
          className="text-center py-20"
          data-ocid="search.no_results.empty_state"
        >
          <p className="text-muted-foreground">
            No results for &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}

      {matchedArtists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Artists
          </h2>
          <div className="space-y-2">
            {matchedArtists.map((artist, i) => (
              <button
                type="button"
                key={artist.id}
                data-ocid={`search.artist.item.${i + 1}`}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 cursor-pointer transition-colors text-left"
                onClick={() => {
                  setSelectedArtistId(artist.id);
                  setCurrentView("artist");
                }}
              >
                <div
                  className={`${artist.gradientClass} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {artist.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {artist.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {artist.language}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {matchedSongs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <Music className="w-4 h-4" /> Songs
          </h2>
          <div className="space-y-1">
            {matchedSongs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i + 1}
                queue={matchedSongs}
                dataOcid={`search.song.item.${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
