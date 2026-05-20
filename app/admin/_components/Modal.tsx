"use client";

import { C } from "./constants";

export function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", padding: 16 }}>
      <div className="pro-glass" style={{ borderRadius: 24, padding: 28, width: "100%", maxWidth: 440, direction: "rtl" }}>
        <h2 style={{ fontFamily: "var(--font-outfit),'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: C.onSurface, marginBottom: 20 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: C.onSurfVar, marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
