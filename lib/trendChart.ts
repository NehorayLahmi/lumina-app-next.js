export interface TrendItem {
  createdAt: string;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Formats a Date as yyyy-mm-dd for use as an <input type="date"> value, in local time. */
export function formatInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns [from, to] as yyyy-mm-dd for the last `days` days ending today. */
export function presetRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: formatInputDate(from), to: formatInputDate(to) };
}

/** Clamps [from, to] to a valid, ordered range no longer than maxDays. */
export function clampRange(from: Date, to: Date, maxDays = 366): [Date, Date] {
  let [start, end] = from.getTime() <= to.getTime() ? [from, to] : [to, from];
  start = startOfDay(start);
  end = startOfDay(end);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (days > maxDays) {
    start = new Date(end.getTime() - (maxDays - 1) * 86_400_000);
  }
  return [start, end];
}

/** Item counts per calendar day for [from, to] inclusive (oldest first, `to` last). */
export function countsInRange(items: TrendItem[], from: Date, to: Date): number[] {
  const start = startOfDay(from);
  const end = startOfDay(to);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const counts = new Array(days).fill(0);
  for (const item of items) {
    const day = startOfDay(new Date(item.createdAt));
    const index = Math.round((day.getTime() - start.getTime()) / 86_400_000);
    if (index >= 0 && index < days) counts[index]++;
  }
  return counts;
}

/** Date labels (dd/mm) for [from, to] inclusive, thinned to at most `maxLabels` visible entries. */
export function labelsInRange(from: Date, to: Date, maxLabels = 7): string[] {
  const start = startOfDay(from);
  const end = startOfDay(to);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const fmt = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit" });
  const stride = Math.max(1, Math.ceil(days / maxLabels));
  const labels: string[] = [];
  for (let i = 0; i < days; i++) {
    const show = i === 0 || i === days - 1 || i % stride === 0;
    labels.push(show ? fmt.format(new Date(start.getTime() + i * 86_400_000)) : "");
  }
  return labels;
}

interface Point { x: number; y: number }

function catmullRomPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Builds a smooth line + filled-area SVG path from daily counts, scaled into a width×height viewBox. */
export function trendPath(counts: number[], width: number, height: number, topPad = 10) {
  const max = Math.max(1, ...counts);
  const n = counts.length;
  const stepX = n > 1 ? width / (n - 1) : 0;
  const points: Point[] = counts.map((c, i) => ({
    x: i * stepX,
    y: height - (c / max) * (height - topPad),
  }));
  const line = catmullRomPath(points);
  const area = `${line} L${width},${height} L0,${height} Z`;
  return { line, area, points };
}
