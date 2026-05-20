"use client";

import { useRef, useState } from "react";
import { C } from "./constants";

export function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a?.duration) setProgress((a.currentTime / a.duration) * 100);
        }}
      />
      <button onClick={toggle} style={{
        width: 28, height: 28, borderRadius: "50%",
        background: C.tertiary, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: C.onPrimary, fontVariationSettings: "'FILL' 1" }}>
          {playing ? "pause" : "play_arrow"}
        </span>
      </button>
      <div style={{ width: 60, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: C.tertiary, borderRadius: 99, transition: "width 0.2s" }} />
      </div>
    </div>
  );
}
