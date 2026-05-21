import type React from "react";

export const C = {
  bg:         "#15171c",
  primary:    "#deb9f4",
  secondary:  "#fface8",
  tertiary:   "#00daf7",
  onSurface:  "#f4dafe",
  onSurfVar:  "#cdc3ce",
  surfHigh:   "#21242b",
  surfHighest:"#272a32",
  outlineVar: "#2e3139",
  onPrimary:  "#0f1115",
  error:      "#ffb4ab",
};

export const STATUS_LABELS: Record<string, string> = {
  NEW: "חדש", ASSIGNED: "שויך", NOTIFIED: "נשלח", CONVERTED: "הומר",
  completed: "הושלם", "no-answer": "לא ענה", busy: "תפוס", failed: "נכשל",
};

export const STATUS_CLR: Record<string, string> = {
  NEW: C.primary, ASSIGNED: C.tertiary, NOTIFIED: C.secondary, CONVERTED: C.tertiary,
  completed: C.tertiary, "no-answer": C.error, busy: C.secondary, failed: C.error,
};

export const adminInput: React.CSSProperties = {
  width: "100%", height: 44, background: "rgba(21,23,28,0.6)",
  border: `1px solid ${C.outlineVar}55`, borderRadius: 10, padding: "0 12px",
  fontSize: 14, color: C.onSurface, outline: "none", direction: "rtl",
  fontFamily: "inherit", boxSizing: "border-box",
};

export const adminSelect: React.CSSProperties = {
  ...adminInput, appearance: "none", cursor: "pointer",
};
