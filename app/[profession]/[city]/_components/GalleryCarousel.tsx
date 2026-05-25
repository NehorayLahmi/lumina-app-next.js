"use client";

import { useRef } from "react";
import Image from "next/image";

export function GalleryCarousel({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    ref.current?.scrollBy({ left: dir === "next" ? -360 : 360, behavior: "smooth" });
  }

  if (!images.length) return null;

  return (
    <section aria-label="גלריית עבודות" style={{ position: "relative" }}>
      {/* scroll buttons */}
      <div style={{ display: "flex", gap: 12, position: "absolute", top: -52, left: 0, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => scroll("prev")}
          aria-label="תמונה קודמת"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "transparent", border: "1px solid rgba(0,242,255,0.2)", color: "#00f2ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,242,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">chevron_right</span>
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          aria-label="תמונה הבאה"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "transparent", border: "1px solid rgba(0,242,255,0.2)", color: "#00f2ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,242,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">chevron_left</span>
        </button>
      </div>

      {/* carousel strip */}
      <div
        ref={ref}
        role="list"
        aria-label="תמונות עבודות"
        className="hide-scrollbar"
        style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            role="listitem"
            className="cyber-glow"
            style={{ flexShrink: 0, width: 300, height: 420, borderRadius: 28, overflow: "hidden", position: "relative", scrollSnapAlign: "start" }}
          >
            <Image
              src={src}
              alt={`עבודה מספר ${i + 1}`}
              fill
              className="object-cover"
              sizes="300px"
              style={{ filter: "grayscale(30%)", transition: "filter 0.5s, transform 0.5s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(30%)"; (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 18px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#e2e2e7" }}>עבודה {i + 1}</p>
              <p style={{ fontSize: 12, color: "#00f2ff", marginTop: 2 }}>עבודה מקצועית</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
