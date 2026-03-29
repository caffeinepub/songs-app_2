import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { SongRow } from "../components/SongRow";
import { useMusic } from "../context/MusicContext";

export function ArtistDetailView() {
  const { artists, songs, selectedArtistId, setCurrentView, playSong } =
    useMusic();

  const artist = artists.find((a) => a.id === selectedArtistId);
  if (!artist) return null;

  const artistSongs = songs.filter((s) => s.artistId === artist.id);

  return (
    <div className="fade-in">
      <Button
        variant="ghost"
        className="mb-6 text-muted-foreground hover:text-foreground gap-2"
        onClick={() => setCurrentView("browse")}
        data-ocid="artist.back.button"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Button>

      {/* Artist Header */}
      <div
        className={`relative ${artist.gradientClass} rounded-2xl p-8 mb-8 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 flex items-end gap-6">
          <div
            className={`${artist.gradientClass} w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-white font-black text-2xl shadow-2xl flex-shrink-0`}
          >
            {artist.initials}
          </div>
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-medium">
              {artist.language} Artist
            </p>
            <h1 className="text-white font-black text-3xl sm:text-4xl">
              {artist.name}
            </h1>
            <p className="text-white/80 text-sm mt-1 max-w-lg">{artist.bio}</p>
            <Button
              className="mt-3 gradient-accent border-0 text-white font-semibold gap-2"
              style={{
                background:
                  "linear-gradient(135deg, #6A2FF0, #D24BFF, #FF4DA6)",
              }}
              onClick={() =>
                artistSongs.length > 0 && playSong(artistSongs[0], artistSongs)
              }
              data-ocid="artist.play.button"
            >
              <Play className="w-4 h-4" /> Play All
            </Button>
          </div>
        </div>
      </div>

      {/* Songs */}
      <section data-ocid="artist.songs.list">
        <h2 className="text-lg font-bold uppercase tracking-wide text-foreground mb-3">
          Songs{" "}
          <span className="text-muted-foreground font-normal">
            ({artistSongs.length})
          </span>
        </h2>
        <div className="space-y-1">
          {artistSongs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              queue={artistSongs}
              dataOcid={`artist.song.item.${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
