// Compact counts: 842, 1.1K, 12.4K, 1.2M.
export function compact(n: number): string {
  if (n < 1000) return String(Math.round(n));
  if (n < 1_000_000) return `${trim(n / 1000)}K`;
  return `${trim(n / 1_000_000)}M`;
}

function trim(v: number): string {
  const s = v >= 100 ? Math.round(v).toString() : v.toFixed(1);
  return s.endsWith('.0') ? s.slice(0, -2) : s;
}

export function grouped(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 1457 s -> "00:24:17"
export function clock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const p = (v: number) => String(v).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

export function money(v: number): string {
  return `$${v.toFixed(2)}`;
}
