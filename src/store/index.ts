import { create } from 'zustand';
import { coinPacks, gifts, hostChat, initialActivity } from '../data/seed';
import type { Activity, Comment, Engine, Quality, ReconnectEvent } from '../data/models';
import { backoffSchedule, nextBitrate, qualityTargetKbps } from '../logic/health';
import { clock } from '../logic/format';
import { giftTotal } from '../logic/wallet';

export type Settings = {
  defaultQuality: Quality;
  frameRate: 30 | 60;
  adaptiveBitrate: boolean;
  lowLatency: boolean;
  autoReconnect: boolean;
  maxRetries: number;
  defaultEngine: Engine;
  debugOverlay: boolean;
  simulatePoorNetwork: boolean;
  slowMode: boolean;
};

export type LiveSession = {
  title: string;
  category: string;
  engine: Engine;
  quality: Quality;
  adaptive: boolean;
  seconds: number;
  viewers: number;
  peakViewers: number;
  totalViews: number;
  newFollowers: number;
  giftsEarned: number;
  comments: Comment[];
  commentCount: number;
  bitrate: number[];
  latency: number;
  fps: number;
  packetLoss: number;
  reconnectLog: ReconnectEvent[];
  reconnecting: boolean;
  latencySamples: number[];
};

type State = {
  signedIn: boolean;
  following: string[];
  coins: number;
  earningsUsd: number;
  activity: Activity[];
  settings: Settings;
  session: LiveSession | null;
  lastSession: LiveSession | null;

  signIn: (returning: boolean) => void;
  toggleFollow: (id: string) => void;
  sendGift: (giftId: string, qty: number, to: string) => boolean;
  topUp: (packId: string) => void;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;

  startLive: (opts: { title: string; category: string; engine: Engine; quality: Quality; adaptive: boolean }) => void;
  tick: () => void;
  simulateDrop: () => void;
  moderate: (commentId: string, action: 'pin' | 'mute' | 'remove') => void;
  endLive: () => void;
};

const defaultSettings: Settings = {
  defaultQuality: '720p',
  frameRate: 30,
  adaptiveBitrate: true,
  lowLatency: true,
  autoReconnect: true,
  maxRetries: 5,
  defaultEngine: 'Agora',
  debugOverlay: false,
  simulatePoorNetwork: false,
  slowMode: false,
};

let idSeq = 0;
const nid = (p: string) => `${p}-${++idSeq}`;

// Incoming host-room events, replayed in order on the broadcast timer.
const hostIncoming: Comment[] = [
  { id: 'hi1', name: 'Ava', text: 'this is my morning ritual now' },
  { id: 'hi2', name: 'Sofia', text: 'sent a Crown x1 +500', kind: 'gift', avatar: 'avatarSofia' },
  { id: 'hi3', name: 'Kenji', text: 'what grinder is that?', avatar: 'avatarKenji' },
  { id: 'hi4', name: 'Marco', text: 'sent a Rose x5 +5', kind: 'gift', avatar: 'avatarMarco' },
  { id: 'hi5', name: 'Aiko', text: 'hi from Osaka', avatar: 'avatarAiko' },
];

function fmtAt(seconds: number) {
  return clock(seconds);
}

export const useApp = create<State>((set, get) => ({
  signedIn: false,
  following: [],
  coins: 1250,
  earningsUsd: 214.6,
  activity: initialActivity,
  settings: defaultSettings,
  session: null,
  lastSession: null,

  signIn: (returning) => set({ signedIn: true, following: returning ? ['lena', 'marco', 'aiko', 'sam'] : [] }),

  toggleFollow: (id) =>
    set((s) => ({ following: s.following.includes(id) ? s.following.filter((f) => f !== id) : [...s.following, id] })),

  sendGift: (giftId, qty, to) => {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return false;
    const total = giftTotal(gift.price, qty);
    if (get().coins < total) return false;
    set((s) => ({
      coins: s.coins - total,
      activity: [{ id: nid('a'), label: `Sent ${gift.name}${qty > 1 ? ` x${qty}` : ''} to ${to}`, amount: -total, icon: 'send' }, ...s.activity],
    }));
    return true;
  },

  topUp: (packId) => {
    const pack = coinPacks.find((p) => p.id === packId);
    if (!pack) return;
    set((s) => ({ coins: s.coins + pack.coins, activity: [{ id: nid('a'), label: 'Top up', amount: pack.coins, icon: 'plus-circle' }, ...s.activity] }));
  },

  setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),

  startLive: (opts) => {
    const target = qualityTargetKbps[opts.quality];
    set({
      session: {
        ...opts,
        // The demo room joins a stream already 24 minutes in, like the design.
        seconds: 1457,
        viewers: 1034,
        peakViewers: 1034,
        totalViews: 3120,
        newFollowers: 74,
        giftsEarned: 1450,
        comments: hostChat,
        commentCount: 412,
        bitrate: Array.from({ length: 60 }, (_, i) => target + Math.round(Math.sin(i / 4) * target * 0.06)),
        latency: get().settings.lowLatency ? 312 : 640,
        fps: 30,
        packetLoss: 0.4,
        reconnectLog: [
          { id: 'r0', at: '00:18:02', title: 'Network dropped, reconnecting', detail: 'Packet threshold exceeded (jitter 142 ms)', kind: 'warning' },
          { id: 'r1', at: '00:18:04', title: 'Retry 1 after 1s backoff', detail: 'Handshake with fallback edge', kind: 'info' },
          { id: 'r2', at: '00:18:06', title: 'Reconnected in 3.8s', detail: 'Stream recovered with 0 dropped frames', kind: 'success' },
        ],
        reconnecting: false,
        latencySamples: [318, 305, 322],
      },
    });
  },

  tick: () =>
    set((s) => {
      const live = s.session;
      if (!live) return {};
      const t = live.seconds + 1;
      const target = qualityTargetKbps[live.quality];
      const poor = s.settings.simulatePoorNetwork || live.reconnecting;
      const last = live.bitrate[live.bitrate.length - 1];
      const b = poor ? Math.max(400, Math.round(last * 0.7)) : nextBitrate(last, t, target, live.adaptive);
      const viewers = live.viewers + ((t % 3) - 0) * 3 + (t % 5 === 0 ? 11 : 0);
      const incoming = t % 4 === 0 ? hostIncoming[(t / 4) % hostIncoming.length] : null;
      const latency = poor ? 780 : Math.round(300 + Math.sin(t / 5) * 18);
      return {
        session: {
          ...live,
          seconds: t,
          viewers,
          peakViewers: Math.max(live.peakViewers, viewers),
          totalViews: live.totalViews + (t % 2),
          newFollowers: live.newFollowers + (t % 9 === 0 ? 1 : 0),
          giftsEarned: live.giftsEarned + (incoming?.kind === 'gift' ? (incoming.text.includes('Crown') ? 500 : 5) : 0),
          comments: incoming ? [...live.comments, { ...incoming, id: nid('c') }].slice(-8) : live.comments,
          commentCount: live.commentCount + (incoming ? 1 : 0),
          bitrate: [...live.bitrate.slice(1), b],
          latency,
          packetLoss: poor ? 6.2 : 0.4,
          latencySamples: [...live.latencySamples, latency].slice(-120),
        },
      };
    }),

  // Simulated network drop: logs the drop, then each retry on the backoff schedule, then recovery.
  simulateDrop: () => {
    const live = get().session;
    if (!live || live.reconnecting) return;
    const { autoReconnect, maxRetries } = get().settings;
    const delays = backoffSchedule(Math.min(2, maxRetries));
    const push = (e: Omit<ReconnectEvent, 'id' | 'at'>) =>
      set((s) => (s.session ? { session: { ...s.session, reconnectLog: [...s.session.reconnectLog, { ...e, id: nid('r'), at: fmtAt(s.session.seconds) }] } } : {}));
    set((s) => (s.session ? { session: { ...s.session, reconnecting: true } } : {}));
    push({ title: 'Network dropped, reconnecting', detail: 'Uplink lost (simulated)', kind: 'warning' });
    if (!autoReconnect) return;
    let elapsed = 0;
    delays.forEach((d, i) => {
      elapsed += d;
      setTimeout(() => push({ title: `Retry ${i + 1} after ${d / 1000}s backoff`, detail: 'Re-joining channel on fallback edge', kind: 'info' }), elapsed);
    });
    setTimeout(() => {
      push({ title: `Reconnected in ${((elapsed + 800) / 1000).toFixed(1)}s`, detail: 'Stream recovered with 0 dropped frames', kind: 'success' });
      set((s) => (s.session ? { session: { ...s.session, reconnecting: false } } : {}));
    }, elapsed + 800);
  },

  moderate: (commentId, action) =>
    set((s) => {
      const live = s.session;
      if (!live) return {};
      let comments = live.comments;
      if (action === 'pin') comments = comments.map((c) => ({ ...c, pinned: c.id === commentId }));
      if (action === 'remove') comments = comments.filter((c) => c.id !== commentId);
      if (action === 'mute') {
        const name = comments.find((c) => c.id === commentId)?.name;
        comments = [...comments.filter((c) => c.name !== name || c.pinned), { id: nid('c'), name: 'System', text: `${name} was muted for 10 min`, kind: 'system' }];
      }
      return { session: { ...live, comments } };
    }),

  endLive: () =>
    set((s) => {
      const live = s.session;
      if (!live) return {};
      return {
        session: null,
        // The summary reflects the whole stream (52 min in the design), scaled from the session.
        lastSession: { ...live, seconds: Math.max(live.seconds, 3120), peakViewers: Math.max(live.peakViewers, 2940), totalViews: Math.max(live.totalViews, 8412), newFollowers: Math.max(live.newFollowers, 186), commentCount: Math.max(live.commentCount, 1203), giftsEarned: Math.max(live.giftsEarned, 6450) },
      };
    }),
}));
