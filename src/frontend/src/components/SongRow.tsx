import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, Plus } from "lucide-react";
import { useMusic } from "../context/MusicContext";
import type { Song } from "../types";
import { AlbumArt } from "./AlbumArt";

interface SongRowProps {
  song: Song;
  index: number;
  queue: Song[];
  dataOcid?: string;
}

export function SongRow({ song, index, queue, dataOcid }: SongRowProps) {
  const { playSong, currentSong, isPlaying, playlists, addSongToPlaylist } =
    useMusic();
  const isActive = currentSong?.id === song.id;

  return (
    <button
      type="button"
      data-ocid={dataOcid ?? `song.item.${index}`}
      className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-left ${
        isActive
          ? "bg-music-elevated border border-border"
          : "hover:bg-muted/40"
      }`}
      onClick={() => playSong(song, queue)}
    >
      <div className="w-7 text-center flex-shrink-0">
        {isActive && isPlaying ? (
          <span className="flex items-end gap-[2px] h-4 justify-center">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full"
                style={{
                  height: "100%",
                  animation: `equalizer 0.8s ease-in-out ${i * 0.2}s infinite`,
                  background: "linear-gradient(180deg, #D24BFF, #FF7A3D)",
                }}
              />
            ))}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground group-hover:hidden">
            {index}
          </span>
        )}
        <Play
          className={`w-3.5 h-3.5 text-foreground mx-auto hidden group-hover:block ${
            isActive ? "hidden group-hover:hidden" : ""
          }`}
        />
      </div>

      <AlbumArt gradientClass={song.gradientClass} size={38} />

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "text-music-magenta" : "text-foreground"
          }`}
        >
          {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {song.artistName}
        </p>
      </div>

      <Badge
        variant="outline"
        className="hidden sm:flex text-xs border-border text-muted-foreground"
      >
        {song.genre}
      </Badge>

      <span className="text-xs text-muted-foreground w-10 text-right flex-shrink-0">
        {song.duration}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
            data-ocid={`song.dropdown_menu.${index}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover border-border">
          {playlists.length > 0 ? (
            playlists.map((pl) => (
              <DropdownMenuItem
                key={pl.id}
                onClick={(e) => {
                  e.stopPropagation();
                  addSongToPlaylist(pl.id, song.id);
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Add to {pl.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
}
