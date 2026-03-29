import { Slider } from "@/components/ui/slider";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusic } from "../context/MusicContext";
import { AlbumArt } from "./AlbumArt";

export function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    pauseResume,
    nextSong,
    prevSong,
    setVolume,
    setProgress,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
  } = useMusic();

  const progressPercent = Math.min(100, Math.max(0, progress));
  const elapsed = currentSong
    ? Math.round((progressPercent / 100) * currentSong.durationSeconds)
    : 0;
  const totalSec = currentSong?.durationSeconds ?? 0;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <footer
      className="h-[84px] glass glass-border border-t flex items-center px-4 gap-4 z-30 flex-shrink-0"
      data-ocid="player.panel"
    >
      {/* Left: song info */}
      <div className="flex items-center gap-3 w-52 flex-shrink-0">
        {currentSong ? (
          <>
            <AlbumArt
              gradientClass={currentSong.gradientClass}
              size={48}
              isPlaying={isPlaying}
              className="rounded-lg shadow-glow"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {currentSong.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artistName}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No song selected</p>
        )}
      </div>

      {/* Center: controls + seek */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            data-ocid="player.toggle"
            onClick={toggleShuffle}
            className={`p-1 transition-colors ${isShuffle ? "text-music-magenta" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="player.pagination_prev"
            onClick={prevSong}
            disabled={!currentSong}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            type="button"
            data-ocid="player.primary_button"
            onClick={pauseResume}
            disabled={!currentSong}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-glow transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 pulse-glow"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 translate-x-0.5" />
            )}
          </button>
          <button
            type="button"
            data-ocid="player.pagination_next"
            onClick={nextSong}
            disabled={!currentSong}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          >
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            type="button"
            data-ocid="player.repeat.toggle"
            onClick={toggleRepeat}
            className={`p-1 transition-colors ${isRepeat ? "text-music-magenta" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seek bar */}
        <div className="w-full max-w-md flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-7 text-right">
            {fmt(elapsed)}
          </span>
          <div className="flex-1 relative">
            <Slider
              data-ocid="player.input"
              value={[progressPercent]}
              max={100}
              step={0.5}
              disabled={!currentSong}
              onValueChange={([v]) => setProgress(v)}
              className="[&>[role=slider]]:w-3 [&>[role=slider]]:h-3 [&>[role=slider]]:bg-white"
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-7">
            {fmt(totalSec)}
          </span>
        </div>
      </div>

      {/* Right: volume */}
      <div className="flex items-center gap-2 w-36 flex-shrink-0 justify-end">
        <button
          type="button"
          onClick={() => setVolume(volume === 0 ? 75 : 0)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="player.volume.toggle"
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <Slider
          data-ocid="player.volume.input"
          value={[volume]}
          max={100}
          step={1}
          onValueChange={([v]) => setVolume(v)}
          className="w-20 [&>[role=slider]]:w-3 [&>[role=slider]]:h-3 [&>[role=slider]]:bg-white"
        />
      </div>
    </footer>
  );
}
