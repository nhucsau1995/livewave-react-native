import type { Activity, CoinPack, Comment, Creator, Gift, Replay, ScheduleItem, Stream } from './models';

export const me = { name: 'Maya Chen', first: 'Maya', handle: '@mayalive', followers: 3210, following: 184, streams: 46 };

export const creators: Creator[] = [
  { id: 'lena', name: 'Lena Park', handle: '@lenaplays', avatar: 'avatarLena', category: 'Music', followers: 48200, bio: 'Acoustic covers every night 8pm. Sharing original arrangements and soulful vibes.', streams: 312, rating: 4.9 },
  { id: 'kairo', name: 'DJ Kairo', handle: '@djkairo', avatar: 'avatarSam', category: 'Music', followers: 128000, bio: 'House and disco sets every Friday.', streams: 540, rating: 4.8 },
  { id: 'marco', name: 'Marco Ruiz', handle: '@marcocooks', avatar: 'avatarMarco', category: 'Cooking', followers: 34100, bio: 'Handmade pasta and slow food.', streams: 188, rating: 4.7 },
  { id: 'aiko', name: 'Aiko Tan', handle: '@aikoart', avatar: 'avatarAiko', category: 'Art', followers: 18300, bio: 'Oil painting and illustration, live.', streams: 96, rating: 4.9 },
  { id: 'sam', name: 'Sam Okafor', handle: '@samlifts', avatar: 'avatarSam', category: 'Fitness', followers: 95100, bio: 'Kettlebell HIIT at 7am.', streams: 402, rating: 4.8 },
  { id: 'sofia', name: 'Sofia Chen', handle: '@sofiapaints', avatar: 'avatarSofia', category: 'Art', followers: 22800, bio: 'City sketches and travel diaries.', streams: 74, rating: 4.6 },
];

export const featured: Stream = { id: 's-kairo', creatorId: 'kairo', title: 'Friday Night House Set', category: 'Music', viewers: 12400, thumb: 'streamDjKairo', live: true };

export const liveNow: Stream[] = [
  { id: 's-pasta', creatorId: 'marco', title: 'Artisanal Handmade Pasta', category: 'Cooking', viewers: 842, thumb: 'streamPasta', live: true },
  { id: 's-lena', creatorId: 'lena', title: 'Acoustic Sunday Jam', category: 'Music', viewers: 2481, thumb: 'streamAcoustic', live: true },
  { id: 's-hiit', creatorId: 'sam', title: 'Full Body Kettlebell HIIT', category: 'Fitness', viewers: 1100, thumb: 'streamHiit', live: true },
  { id: 's-lisbon', creatorId: 'lena', title: 'Lisbon Sunset Walking Tour', category: 'Travel', viewers: 530, thumb: 'streamLisbon', live: true },
];

export const trending: Stream[] = [
  { id: 's-paint', creatorId: 'sofia', title: 'Live Oil Painting: City Lights', category: 'Art', viewers: 2400, thumb: 'streamPainter', live: true },
  { id: 's-chef', creatorId: 'marco', title: 'Omakase Plating Night', category: 'Cooking', viewers: 1800, thumb: 'streamChefPlating', live: true },
  { id: 's-sax', creatorId: 'aiko', title: 'Street Sax After Dark', category: 'Music', viewers: 960, thumb: 'streamSaxophone', live: true },
];

export const topCategories = [
  { name: 'Music', live: '1.2K live', thumb: 'streamAcoustic' as const },
  { name: 'Cooking', live: '640 live', thumb: 'streamChefPlating' as const },
  { name: 'Fitness', live: '410 live', thumb: 'streamHiit' as const },
  { name: 'Travel', live: '280 live', thumb: 'streamLisbon' as const },
];

export const categories = ['All', 'Music', 'Gaming', 'Cooking', 'Fitness', 'Talk', 'Travel', 'Art'] as const;

export const schedule: ScheduleItem[] = [
  { id: 'mon', day: 'Mon', time: '8:00 PM', title: 'Acoustic requests and chill chat' },
  { id: 'wed', day: 'Wed', time: '8:00 PM', title: 'Songwriting session and new drafts' },
];

export const lenaReplays: Replay[] = [
  { id: 'r1', title: 'Piano and Vocal Session', thumb: 'replayPiano', duration: '48:10', views: '12.1K views', ago: '3d ago' },
  { id: 'r2', title: 'Sunday Acoustic Jam', thumb: 'streamAcoustic', duration: '1:05:22', views: '9.8K views', ago: '1w ago' },
];

export const myReplays: Replay[] = [
  { id: 'm1', title: 'Cooking and Chatting', thumb: 'streamPasta', duration: '52:10', views: '8.4K views', ago: '2d ago' },
  { id: 'm2', title: 'Morning Coffee and Q&A', thumb: 'liveHostCoffee', duration: '45:20', views: '5.1K views', ago: '4d ago' },
  { id: 'm3', title: 'Painting in the Studio', thumb: 'replayPainting', duration: '1:12:04', views: '9.2K views', ago: '6d ago' },
  { id: 'm4', title: 'Late Night City Stroll', thumb: 'replayCityWalk', duration: '38:15', views: '6.7K views', ago: '1w ago' },
];

export const gifts: Gift[] = [
  { id: 'rose', name: 'Rose', price: 1, icon: 'flower-outline' },
  { id: 'heart', name: 'Heart', price: 5, icon: 'heart-outline' },
  { id: 'coffee', name: 'Coffee', price: 10, icon: 'cafe-outline' },
  { id: 'star', name: 'Star', price: 25, icon: 'star-outline' },
  { id: 'mic', name: 'Mic', price: 50, icon: 'mic-outline' },
  { id: 'rocket', name: 'Rocket', price: 100, icon: 'rocket-outline' },
  { id: 'crown', name: 'Crown', price: 500, icon: 'trophy-outline' },
  { id: 'wave', name: 'Wave', price: 1000, icon: 'water-outline' },
];

export const coinPacks: CoinPack[] = [
  { id: 'p100', coins: 100, price: 0.99 },
  { id: 'p500', coins: 500, price: 4.99 },
  { id: 'p1200', coins: 1200, price: 9.99, popular: true },
  { id: 'p2500', coins: 2500, price: 19.99 },
  { id: 'p6500', coins: 6500, price: 49.99 },
  { id: 'p14000', coins: 14000, price: 99.99 },
];

export const initialActivity: Activity[] = [
  { id: 'a1', label: 'Sent Rocket to Lena Park', amount: -100, icon: 'send' },
  { id: 'a2', label: 'Received Crown from Sofia', amount: 500, icon: 'gift' },
  { id: 'a3', label: 'Top up', amount: 1200, icon: 'plus-circle' },
];

// Viewer chat script for the watch screen; new lines arrive on a timer.
export const viewerChat: Comment[] = [
  { id: 'v1', name: 'Ava', text: 'play Yellow please!' },
  { id: 'v2', name: 'Kenji', text: 'hello from Tokyo', avatar: 'avatarKenji' },
  { id: 'v3', name: 'Sofia', text: 'your voice is unreal', avatar: 'avatarSofia' },
  { id: 'v4', name: 'Marco', text: 'first time here', avatar: 'avatarMarco' },
  { id: 'v5', name: 'Marco', text: 'sent a Rose x5', kind: 'gift' },
  { id: 'v6', name: 'Aiko', text: 'love this song', avatar: 'avatarAiko' },
  { id: 'v7', name: 'Sam', text: 'that chord change!', avatar: 'avatarSam' },
  { id: 'v8', name: 'Ava', text: 'encore please', },
];

// Host room chat; one is pinned by default.
export const hostChat: Comment[] = [
  { id: 'h1', name: 'Ava', text: 'what coffee beans do you use?', pinned: true },
  { id: 'h2', name: 'Kenji', text: 'good morning!', avatar: 'avatarKenji' },
  { id: 'h3', name: 'Marco', text: 'from Madrid', avatar: 'avatarMarco' },
  { id: 'h4', name: 'Aiko', text: 'love the setup', avatar: 'avatarAiko' },
  { id: 'h5', name: 'Sam', text: 'how long have you been streaming?', avatar: 'avatarSam' },
  { id: 'h6', name: 'Sofia', text: 'the light in here is so nice', avatar: 'avatarSofia' },
];

export const topSupporters = [
  { name: 'Sofia', note: 'Top contributor', coins: 1500, avatar: 'avatarSofia' as const },
  { name: 'Marco', note: 'Subscribed 3mo', coins: 900, avatar: 'avatarMarco' as const },
  { name: 'Kenji', note: 'Sent Super Heart', coins: 600, avatar: 'avatarKenji' as const },
];

export const engineCaption: Record<string, string> = {
  Agora: 'Ultra low latency, under 400 ms',
  LiveKit: 'SFU rooms, simulcast layers, under 500 ms',
  WebRTC: 'Peer-to-peer, best for small rooms',
};
