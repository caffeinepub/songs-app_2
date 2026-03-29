import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ListMusic, Play, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { SongRow } from "../components/SongRow";
import { useMusic } from "../context/MusicContext";
import type { Playlist } from "../types";

export function PlaylistsView() {
  const {
    playlists,
    songs,
    createPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    playSong,
    selectedPlaylistId,
    setSelectedPlaylistId,
  } = useMusic();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(
    selectedPlaylistId
      ? (playlists.find((p) => p.id === selectedPlaylistId) ?? null)
      : null,
  );

  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName.trim());
      setNewName("");
      setCreateOpen(false);
    }
  };

  const handleOpenPlaylist = (pl: Playlist) => {
    setActivePlaylist(pl);
    setSelectedPlaylistId(pl.id);
  };

  if (activePlaylist) {
    const pl = playlists.find((p) => p.id === activePlaylist.id);
    if (!pl) {
      setActivePlaylist(null);
      return null;
    }
    const plSongs = songs.filter((s) => pl.songIds.includes(s.id));

    return (
      <div className="fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setActivePlaylist(null);
              setSelectedPlaylistId(null);
            }}
            data-ocid="playlist.back.button"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-foreground">{pl.name}</h1>
            <p className="text-xs text-muted-foreground">
              {pl.songIds.length} songs
            </p>
          </div>
          {plSongs.length > 0 && (
            <Button
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="gap-2 text-white border-0"
              onClick={() => playSong(plSongs[0], plSongs)}
              data-ocid="playlist.play.button"
            >
              <Play className="w-4 h-4" /> Play All
            </Button>
          )}
        </div>

        {plSongs.length === 0 ? (
          <div
            className="text-center py-20"
            data-ocid="playlist.songs.empty_state"
          >
            <ListMusic className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">This playlist is empty</p>
            <p className="text-xs text-muted-foreground mt-1">
              Browse songs and add them via the ⋯ menu
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {plSongs.map((song, i) => (
              <div key={song.id} className="flex items-center group">
                <div className="flex-1 min-w-0">
                  <SongRow
                    song={song}
                    index={i + 1}
                    queue={plSongs}
                    dataOcid={`playlist.song.item.${i + 1}`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 ml-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={() => removeSongFromPlaylist(pl.id, song.id)}
                  data-ocid={`playlist.song.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
          Playlists
        </h1>
        <Button
          onClick={() => setCreateOpen(true)}
          style={{ background: "linear-gradient(135deg, #6A2FF0, #D24BFF)" }}
          className="gap-2 text-white border-0"
          data-ocid="playlists.open_modal_button"
        >
          <Plus className="w-4 h-4" /> New Playlist
        </Button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-24" data-ocid="playlists.empty_state">
          <ListMusic className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-1">No playlists yet</p>
          <p className="text-muted-foreground text-sm">
            Create your first playlist to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((pl, i) => (
            <button
              type="button"
              key={pl.id}
              data-ocid={`playlists.item.${i + 1}`}
              className="group relative rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-transform text-left"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.05 285), oklch(0.14 0.04 285))",
              }}
              onClick={() => handleOpenPlaylist(pl)}
            >
              <div
                className="w-14 h-14 rounded-xl mb-3 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
                }}
              >
                <ListMusic className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-foreground text-sm truncate">
                {pl.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pl.songIds.length} songs
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 w-7 h-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
                data-ocid={`playlists.delete_button.${i + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </button>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          className="bg-popover border-border"
          data-ocid="playlists.dialog"
        >
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <Input
            data-ocid="playlists.input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Playlist name"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setCreateOpen(false)}
              data-ocid="playlists.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="text-white border-0"
              data-ocid="playlists.submit_button"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
