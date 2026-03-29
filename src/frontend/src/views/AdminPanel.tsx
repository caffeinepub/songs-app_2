import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMusic } from "../context/MusicContext";
import type { Artist, Song } from "../types";

const GRADIENT_OPTIONS = [
  { label: "Purple (Arijit)", value: "gradient-arijit" },
  { label: "Pink-Red (Jubin)", value: "gradient-jubin" },
  { label: "Blue (Shreya)", value: "gradient-shreya" },
  { label: "Green (Diljit)", value: "gradient-diljit" },
  { label: "Pink-Yellow (AP)", value: "gradient-apdhillon" },
  { label: "Lavender (Sidhu)", value: "gradient-sidhu" },
];

const ADMIN_PASSWORD = "admin123";

export function AdminPanel() {
  const {
    artists,
    songs,
    isAdminLoggedIn,
    setAdminLoggedIn,
    addArtist,
    updateArtist,
    deleteArtist,
    addSong,
    updateSong,
    deleteSong,
  } = useMusic();

  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);

  // Artist form
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [editArtist, setEditArtist] = useState<Artist | null>(null);
  const [artistForm, setArtistForm] = useState({
    name: "",
    language: "Hindi" as "Hindi" | "Punjabi",
    bio: "",
    gradientClass: "gradient-arijit",
    initials: "",
  });

  // Song form
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [editSong, setEditSong] = useState<Song | null>(null);
  const [songForm, setSongForm] = useState({
    title: "",
    artistId: "",
    year: new Date().getFullYear().toString(),
    duration: "3:30",
    genre: "Romantic",
    gradientClass: "gradient-arijit",
  });

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAdminLoggedIn(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const openAddArtist = () => {
    setEditArtist(null);
    setArtistForm({
      name: "",
      language: "Hindi",
      bio: "",
      gradientClass: "gradient-arijit",
      initials: "",
    });
    setArtistDialogOpen(true);
  };
  const openEditArtist = (a: Artist) => {
    setEditArtist(a);
    setArtistForm({
      name: a.name,
      language: a.language,
      bio: a.bio,
      gradientClass: a.gradientClass,
      initials: a.initials,
    });
    setArtistDialogOpen(true);
  };
  const handleSaveArtist = () => {
    if (!artistForm.name.trim()) return;
    if (editArtist) {
      updateArtist({ ...editArtist, ...artistForm });
    } else {
      addArtist(artistForm);
    }
    setArtistDialogOpen(false);
  };

  const openAddSong = () => {
    setEditSong(null);
    setSongForm({
      title: "",
      artistId: artists[0]?.id ?? "",
      year: new Date().getFullYear().toString(),
      duration: "3:30",
      genre: "Romantic",
      gradientClass: "gradient-arijit",
    });
    setSongDialogOpen(true);
  };
  const openEditSong = (s: Song) => {
    setEditSong(s);
    setSongForm({
      title: s.title,
      artistId: s.artistId,
      year: s.year.toString(),
      duration: s.duration,
      genre: s.genre,
      gradientClass: s.gradientClass,
    });
    setSongDialogOpen(true);
  };
  const handleSaveSong = () => {
    if (!songForm.title.trim() || !songForm.artistId) return;
    const artist = artists.find((a) => a.id === songForm.artistId);
    const songData = {
      title: songForm.title,
      artistId: songForm.artistId,
      artistName: artist?.name ?? "",
      year: Number.parseInt(songForm.year, 10) || new Date().getFullYear(),
      duration: songForm.duration,
      genre: songForm.genre,
      gradientClass: songForm.gradientClass,
    };
    if (editSong) {
      updateSong({ ...editSong, ...songData });
    } else {
      addSong(songData);
    }
    setSongDialogOpen(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="fade-in flex items-center justify-center min-h-[60vh]">
        <div
          className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm"
          data-ocid="admin.login.panel"
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #6A2FF0, #D24BFF)" }}
          >
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-center text-foreground mb-1">
            Admin Access
          </h2>
          <p className="text-xs text-center text-muted-foreground mb-6">
            Enter password to continue
          </p>
          <div className="space-y-3">
            <Input
              data-ocid="admin.password.input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={pwError ? "border-destructive" : ""}
              autoFocus
            />
            {pwError && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.login.error_state"
              >
                Incorrect password
              </p>
            )}
            <Button
              className="w-full text-white border-0"
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              onClick={handleLogin}
              data-ocid="admin.login.submit_button"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">
          Admin Panel
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAdminLoggedIn(false)}
          data-ocid="admin.logout.button"
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="artists" data-ocid="admin.tabs">
        <TabsList className="mb-6 bg-card border border-border">
          <TabsTrigger value="artists" data-ocid="admin.artists.tab">
            Artists ({artists.length})
          </TabsTrigger>
          <TabsTrigger value="songs" data-ocid="admin.songs.tab">
            Songs ({songs.length})
          </TabsTrigger>
        </TabsList>

        {/* Artists Tab */}
        <TabsContent value="artists">
          <div className="flex justify-end mb-3">
            <Button
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="gap-2 text-white border-0"
              onClick={openAddArtist}
              data-ocid="admin.artist.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Artist
            </Button>
          </div>
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.artists.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Artist</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Songs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.map((artist, i) => (
                  <TableRow
                    key={artist.id}
                    className="border-border"
                    data-ocid={`admin.artist.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`${artist.gradientClass} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
                          {artist.initials}
                        </div>
                        <span className="font-medium text-sm">
                          {artist.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {artist.language}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {songs.filter((s) => s.artistId === artist.id).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          onClick={() => openEditArtist(artist)}
                          data-ocid={`admin.artist.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteArtist(artist.id)}
                          data-ocid={`admin.artist.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Songs Tab */}
        <TabsContent value="songs">
          <div className="flex justify-end mb-3">
            <Button
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="gap-2 text-white border-0"
              onClick={openAddSong}
              data-ocid="admin.song.open_modal_button"
            >
              <Plus className="w-4 h-4" /> Add Song
            </Button>
          </div>
          <div
            className="rounded-xl border border-border overflow-hidden"
            data-ocid="admin.songs.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Song</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {songs.map((song, i) => (
                  <TableRow
                    key={song.id}
                    className="border-border"
                    data-ocid={`admin.song.row.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {song.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {song.artistName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {song.genre}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {song.duration}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          onClick={() => openEditSong(song)}
                          data-ocid={`admin.song.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteSong(song.id)}
                          data-ocid={`admin.song.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Artist Dialog */}
      <Dialog open={artistDialogOpen} onOpenChange={setArtistDialogOpen}>
        <DialogContent
          className="bg-popover border-border"
          data-ocid="admin.artist.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editArtist ? "Edit Artist" : "Add Artist"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="artist-name">Name</Label>
              <Input
                id="artist-name"
                data-ocid="admin.artist.name.input"
                value={artistForm.name}
                onChange={(e) =>
                  setArtistForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Artist name"
              />
            </div>
            <div>
              <Label htmlFor="artist-initials">Initials</Label>
              <Input
                id="artist-initials"
                data-ocid="admin.artist.initials.input"
                value={artistForm.initials}
                onChange={(e) =>
                  setArtistForm((p) => ({ ...p, initials: e.target.value }))
                }
                placeholder="e.g. AS"
                maxLength={3}
              />
            </div>
            <div>
              <Label>Language</Label>
              <Select
                value={artistForm.language}
                onValueChange={(v) =>
                  setArtistForm((p) => ({
                    ...p,
                    language: v as "Hindi" | "Punjabi",
                  }))
                }
              >
                <SelectTrigger data-ocid="admin.artist.language.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="artist-bio">Bio</Label>
              <Input
                id="artist-bio"
                data-ocid="admin.artist.bio.input"
                value={artistForm.bio}
                onChange={(e) =>
                  setArtistForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Short bio"
              />
            </div>
            <div>
              <Label>Gradient Style</Label>
              <Select
                value={artistForm.gradientClass}
                onValueChange={(v) =>
                  setArtistForm((p) => ({ ...p, gradientClass: v }))
                }
              >
                <SelectTrigger data-ocid="admin.artist.gradient.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_OPTIONS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setArtistDialogOpen(false)}
              data-ocid="admin.artist.cancel_button"
            >
              Cancel
            </Button>
            <Button
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="text-white border-0"
              onClick={handleSaveArtist}
              data-ocid="admin.artist.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Song Dialog */}
      <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
        <DialogContent
          className="bg-popover border-border"
          data-ocid="admin.song.dialog"
        >
          <DialogHeader>
            <DialogTitle>{editSong ? "Edit Song" : "Add Song"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="song-title">Title</Label>
              <Input
                id="song-title"
                data-ocid="admin.song.title.input"
                value={songForm.title}
                onChange={(e) =>
                  setSongForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Song title"
              />
            </div>
            <div>
              <Label>Artist</Label>
              <Select
                value={songForm.artistId}
                onValueChange={(v) =>
                  setSongForm((p) => ({ ...p, artistId: v }))
                }
              >
                <SelectTrigger data-ocid="admin.song.artist.select">
                  <SelectValue placeholder="Select artist" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="song-year">Year</Label>
                <Input
                  id="song-year"
                  data-ocid="admin.song.year.input"
                  value={songForm.year}
                  onChange={(e) =>
                    setSongForm((p) => ({ ...p, year: e.target.value }))
                  }
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="song-duration">Duration</Label>
                <Input
                  id="song-duration"
                  data-ocid="admin.song.duration.input"
                  value={songForm.duration}
                  onChange={(e) =>
                    setSongForm((p) => ({ ...p, duration: e.target.value }))
                  }
                  placeholder="3:30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="song-genre">Genre</Label>
              <Input
                id="song-genre"
                data-ocid="admin.song.genre.input"
                value={songForm.genre}
                onChange={(e) =>
                  setSongForm((p) => ({ ...p, genre: e.target.value }))
                }
                placeholder="Romantic, Sad, Pop…"
              />
            </div>
            <div>
              <Label>Gradient Style</Label>
              <Select
                value={songForm.gradientClass}
                onValueChange={(v) =>
                  setSongForm((p) => ({ ...p, gradientClass: v }))
                }
              >
                <SelectTrigger data-ocid="admin.song.gradient.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_OPTIONS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSongDialogOpen(false)}
              data-ocid="admin.song.cancel_button"
            >
              Cancel
            </Button>
            <Button
              style={{
                background: "linear-gradient(135deg, #6A2FF0, #D24BFF)",
              }}
              className="text-white border-0"
              onClick={handleSaveSong}
              data-ocid="admin.song.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
