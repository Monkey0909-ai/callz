import { useNgrokImage } from "@/hooks/useNgrokImage"

/**
 * Drop-in replacement untuk <img> biasa yang otomatis bypass ngrok splash page.
 * Props sama persis dengan <img> HTML biasa (src, alt, className, style, dll).
 * Tambahan: fallbackText (teks saat gagal load, default "Gagal memuat gambar")
 */
export function NgrokImage({ src: url, alt = "", fallbackText = "Gagal memuat gambar", className, style, ...props }) {
  const { src, loading, error } = useNgrokImage(url)

  if (!url) return null

  if (loading) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          color: "#94a3b8",
          fontSize: 12,
          ...style,
        }}
      >
        Memuat...
      </div>
    )
  }

  if (error || !src) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          color: "#94a3b8",
          fontSize: 12,
          ...style,
        }}
      >
        {fallbackText}
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} style={style} {...props} />
}