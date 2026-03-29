import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { useState } from "react";
import { SongRow } from "../components/SongRow";
import { useMusic } from "../context/MusicContext";

export function BrowseView() {
  const { artists, songs, setCurrentView, setSelectedArtistId, playSong } =
    useMusic();
  const [filter, setFilter] = useState<"All" | "Hindi" | "Punjabi">("All");

  const filteredArtists =
    filter === "All" ? artists : artists.filter((a) => a.language === filter);
  const topSongs = songs.slice(0, 10);

  const handleArtistClick = (id: string) => {
    setSelectedArtistId(id);
    setCurrentView("artist");
  };

  const handlePlayArtist = (e: React.MouseEvent, artistId: string) => {
    e.stopPropagation();
    const artistSongs = songs.filter((s) => s.artistId === artistId);
    if (artistSongs.length > 0) playSong(artistSongs[0], artistSongs);
  };

  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl mb-8 p-8"
        style={{
          background:
            "linear-gradient(135deg, #3A1E66 0%, #6A2FF0 30%, #D24BFF 60%, #FF4DA6 80%, #FF7A3D 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-1">
            Discover
          </p>
          <h1 className="text-white font-black text-4xl sm:text-5xl uppercase tracking-tight leading-none">
            Explore Artists
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Hindi & Punjabi music at your fingertips
          </p>
          <div className="flex gap-2 mt-4">
            {(["All", "Hindi", "Punjabi"] as const).map((f) => (
              <button
                type="button"
                key={f}
                data-ocid={`browse.${f.toLowerCase()}.tab`}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-white text-gray-900"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold uppercase tracking-wide text-foreground mb-4">
          Artists
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {filteredArtists.map((artist, i) => (
            <button
              type="button"
              key={artist.id}
              data-ocid={`artists.item.${i + 1}`}
              className="group relative rounded-2xl p-4 cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:shadow-glow text-left"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.05 285), oklch(0.14 0.04 285))",
              }}
              onClick={() => handleArtistClick(artist.id)}
            >
              <div
                className={`${artist.gradientClass} w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-sm shadow-lg`}
              >
                {artist.initials}
              </div>
              <p className="text-sm font-semibold text-center text-foreground truncate">
                {artist.name}
              </p>
              <p className="text-xs text-center text-muted-foreground mt-0.5">
                Top Tracks
              </p>
              <Badge
                variant="outline"
                className="mt-2 mx-auto block w-fit text-xs border-border"
                style={
                  artist.language === "Hindi"
                    ? {
                        borderColor: "oklch(0.65 0.28 310 / 0.5)",
                        color: "oklch(0.75 0.2 310)",
                      }
                    : {
                        borderColor: "oklch(0.71 0.18 40 / 0.5)",
                        color: "oklch(0.75 0.15 40)",
                      }
                }
              >
                {artist.language}
              </Badge>
              <button
                type="button"
                data-ocid={`artists.play.button.${i + 1}`}
                onClick={(e) => handlePlayArtist(e, artist.id)}
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
              >
                <Play className="w-3.5 h-3.5 translate-x-px" />
              </button>
            </button>
          ))}
        </div>
      </section>

      {/* Top Songs */}
      <section data-ocid="browse.songs.list">
        <h2 className="text-xl font-bold uppercase tracking-wide text-foreground mb-3">
          Top Songs This Week
        </h2>
        <div className="space-y-1">
          {topSongs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              queue={topSongs}
              dataOcid={`browse.song.item.${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
