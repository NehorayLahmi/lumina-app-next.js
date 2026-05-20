export const labelOf = (list: { value: string; label: string }[], val: string) =>
  list.find((x) => x.value === val)?.label ?? val;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function formatDuration(sec: number) {
  if (!sec) return "—";
  const m = Math.floor(sec / 60), s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")} דק'` : `${s} שנ'`;
}
