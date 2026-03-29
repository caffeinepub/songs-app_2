interface AlbumArtProps {
  gradientClass: string;
  size?: number;
  className?: string;
  isPlaying?: boolean;
}

export function AlbumArt({
  gradientClass,
  size = 48,
  className = "",
  isPlaying = false,
}: AlbumArtProps) {
  return (
    <div
      className={`${gradientClass} rounded-lg flex-shrink-0 ${isPlaying ? "spin-slow" : ""} ${className}`}
      style={{ width: size, height: size, borderRadius: size * 0.18 }}
    />
  );
}
