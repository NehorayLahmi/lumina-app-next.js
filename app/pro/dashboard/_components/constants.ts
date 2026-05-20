export const C = {
  bg:          "#1d0c26",
  primary:     "#deb9f4",
  secondary:   "#fface8",
  tertiary:    "#00daf7",
  onSurface:   "#f4dafe",
  onSurfVar:   "#cdc3ce",
  surface:     "#2a1933",
  surfLow:     "#25152f",
  surfLowest:  "#170720",
  surfHigh:    "#35233e",
  surfHighest: "#402e49",
  outlineVar:  "#4b444d",
  onPrimary:   "#412454",
};

export const STATUS_LABELS: Record<string, string> = {
  NEW: "חדש", ASSIGNED: "שויך", NOTIFIED: "נשלח", CONVERTED: "הומר",
  completed: "הושלם", "no-answer": "לא ענה", busy: "תפוס", failed: "נכשל",
};

export const STATUS_BG: Record<string, string> = {
  NEW: "rgba(222,185,244,0.15)", ASSIGNED: "rgba(0,218,247,0.15)",
  NOTIFIED: "rgba(255,172,232,0.15)", CONVERTED: "rgba(0,218,247,0.2)",
  completed: "rgba(0,218,247,0.2)", "no-answer": "rgba(255,180,171,0.15)",
  busy: "rgba(255,172,232,0.15)", failed: "rgba(255,180,171,0.15)",
};

export const STATUS_CLR: Record<string, string> = {
  NEW: C.primary, ASSIGNED: "#00daf7", NOTIFIED: "#fface8",
  CONVERTED: "#00daf7", completed: "#00daf7",
  "no-answer": "#ffb4ab", busy: "#fface8", failed: "#ffb4ab",
};
