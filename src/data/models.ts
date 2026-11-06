import type { ImageKey } from './images';

export type Category = 'Music' | 'Gaming' | 'Cooking' | 'Fitness' | 'Talk' | 'Travel' | 'Art';
export type Engine = 'Agora' | 'LiveKit' | 'WebRTC';
export type Quality = '480p' | '720p' | '1080p';

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: ImageKey;
  category: Category;
  followers: number;
  bio: string;
  streams: number;
  rating: number;
};

export type Stream = {
  id: string;
  creatorId: string;
  title: string;
  category: Category;
  viewers: number;
  thumb: ImageKey;
  live: boolean;
};

export type Replay = { id: string; title: string; thumb: ImageKey; duration: string; views: string; ago: string };
export type ScheduleItem = { id: string; day: string; time: string; title: string };

export type Comment = { id: string; name: string; text: string; avatar?: ImageKey; kind?: 'chat' | 'gift' | 'system'; pinned?: boolean };

export type Gift = { id: string; name: string; price: number; icon: string };

export type CoinPack = { id: string; coins: number; price: number; popular?: boolean };

export type Activity = { id: string; label: string; amount: number; icon: string };

export type ReconnectEvent = { id: string; at: string; title: string; detail: string; kind: 'warning' | 'info' | 'success' };
