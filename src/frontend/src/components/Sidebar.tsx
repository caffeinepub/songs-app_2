import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, ListMusic, Music2, Plus, Search, Settings } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import type { ViewType } from "../types";

const navItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: "browse", label: "Browse", icon: <Home className="w-4 h-4" /> },
  { id: "search", label: "Search", icon: <Search className="w-4 h-4" /> },
  {
    id: "playlists",
    label: "Playlists",
    icon: <ListMusic className="w-4 h-4" />,
  },
  { id: "admin", label: "Admin", icon: <Settings className="w-4 h-4" /> },
];

export function Sidebar() {
  const {
    currentView,
    setCurrentView,
    playlists,
    createPlaylist,
    setSelectedPlaylistId,
  } = useMusic();

  const handleCreatePlaylist = () => {
    const name = prompt("Playlist name:");
    if (name?.trim()) createPlaylist(name.trim());
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-sidebar flex flex-col border-r border-border">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-base gradient-text">SurSangeet</span>
      </div>

      {/* Nav */}
      <nav className="px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`nav.${item.id}.link`}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              currentView === item.id
                ? "bg-accent/20 text-music-magenta"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 px-4">
        <div className="h-px bg-border" />
      </div>

      {/* Playlists */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Playlists
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-muted-foreground hover:text-foreground"
          onClick={handleCreatePlaylist}
          data-ocid="sidebar.playlist.button"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 mt-2 pb-4">
        {playlists.length === 0 ? (
          <p className="text-xs text-muted-foreground px-3 py-2">
            No playlists yet
          </p>
        ) : (
          playlists.map((pl) => (
            <button
              type="button"
              key={pl.id}
              onClick={() => {
                setSelectedPlaylistId(pl.id);
                setCurrentView("playlists");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors truncate"
            >
              <ListMusic className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{pl.name}</span>
            </button>
          ))
        )}
      </ScrollArea>
    </aside>
  );
}
