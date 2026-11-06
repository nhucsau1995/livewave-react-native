// Stream health rules used by the host room, the health screen and the summary.

export type HealthSample = { bitrateKbps: number; fps: number; latencyMs: number; packetLoss: number };
export type HealthLevel = 'Excellent' | 'Good' | 'Poor';

export function classify(s: HealthSample, targetKbps = 3000): HealthLevel {
  if (s.packetLoss >= 5 || s.latencyMs >= 800 || s.bitrateKbps < targetKbps * 0.4) return 'Poor';
  if (s.packetLoss >= 1.5 || s.latencyMs >= 450 || s.fps < 25 || s.bitrateKbps < targetKbps * 0.8) return 'Good';
  return 'Excellent';
}

// Exponential reconnect backoff: 1s, 2s, 4s, 8s, 16s (capped), one entry per retry.
export function backoffSchedule(maxRetries: number, baseMs = 1000, capMs = 16000): number[] {
  return Array.from({ length: Math.max(0, maxRetries) }, (_, i) => Math.min(capMs, baseMs * 2 ** i));
}

// Deterministic jitter around a target so the chart moves without randomness in tests.
export function nextBitrate(prev: number, tick: number, targetKbps: number, adaptive: boolean): number {
  const wave = Math.sin(tick / 3) * 180 + Math.cos(tick / 7) * 90;
  const pull = adaptive ? (targetKbps - prev) * 0.25 : 0;
  return Math.max(300, Math.round(prev + pull + wave * 0.35));
}

export function average(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export const qualityTargetKbps: Record<string, number> = { '480p': 1200, '720p': 3000, '1080p': 5500 };
