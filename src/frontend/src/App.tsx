import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Search } from "lucide-react";
import { PlayerBar } from "./components/PlayerBar";
import { Sidebar } from "./components/Sidebar";
import { MusicProvider, useMusic } from "./context/MusicContext";
import { AdminPanel } from "./views/AdminPanel";
import { ArtistDetailView } from "./views/ArtistDetailView";
import { BrowseView } from "./views/BrowseView";
import { PlaylistsView } from "./views/PlaylistsView";
import { SearchView } from "./views/SearchView";

function MainContent() {
  const { currentView, searchQuery, setSearchQuery, setCurrentView } =
    useMusic();

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* Top Header */}
      <header
        className="h-16 flex items-center px-6 gap-4 border-b border-border flex-shrink-0"
        style={{ background: "oklch(0.105 0.003 285)" }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="header.search_input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setCurrentView("search");
            }}
            onFocus={() => {
              if (searchQuery) setCurrentView("search");
            }}
            placeholder="Search songs, artists…"
            className="pl-9 bg-card border-border text-sm h-9"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Hindi & Punjabi Music
          </span>
        </div>
      </header>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {currentView === "browse" && <BrowseView />}
        {currentView === "artist" && <ArtistDetailView />}
        {currentView === "search" && <SearchView />}
        {currentView === "playlists" && <PlaylistsView />}
        {currentView === "admin" && <AdminPanel />}
      </main>
    </div>
  );
}

function AppShell() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative"
      style={{ background: "oklch(0.09 0.003 285)" }}
    >
      {/* Ambient blobs */}
      <div
        className="ambient-blob"
        style={{
          width: 600,
          height: 600,
          top: -200,
          left: -150,
          background:
            "radial-gradient(circle, oklch(0.46 0.26 280 / 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          right: -100,
          background:
            "radial-gradient(circle, oklch(0.71 0.18 40 / 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          width: 400,
          height: 400,
          top: "40%",
          right: "20%",
          background:
            "radial-gradient(circle, oklch(0.65 0.28 310 / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* App layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <MainContent />
      </div>
      <PlayerBar />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <AppShell />
      <Toaster />
    </MusicProvider>
  );
}
