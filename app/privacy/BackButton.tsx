"use client";

import { useRouter } from "next/navigation";

const ON_VAR = "#b4b5b5";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ON_VAR, fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 40 }}
    >
      ← חזרה
    </button>
  );
}
