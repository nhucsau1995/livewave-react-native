# Livewave - Source Brief

## Title
Livewave - live streaming app (go live, watch, chat, gift)

## Description
Livewave is a mobile live streaming app. Viewers discover who is live, watch a stream full screen with a live comments overlay, react with hearts and send coin gifts to creators. Hosts set up a stream (title, category, streaming engine, quality, pre-flight check), run a live room with a broadcast timer, live viewer count, gift alerts and comment moderation, follow stream health in real time (bitrate, FPS, latency, packet loss, reconnects with backoff) and get a post-stream summary. A coin wallet, creator profiles with replays and schedules, and stream settings for reliability and QA complete the loop.

## Store links
Not yet published (portfolio POC). Source: https://github.com/nhucsau1995/livewave-react-native#demo

## Platform
Android demo, iOS-ready codebase (Expo / React Native).

## Category
Media - live streaming, creator economy

## Features
- Live feed discovery: featured stream, following-live row, live-now grid, search, categories, trending, rising creators
- First-run empty state with suggested creators
- Viewer watch screen: full-screen video, live comments overlay, viewer count, follow, floating hearts, live captions, report / block
- Virtual gifts paid with coins (8 gifts, quantity x1/x5/x10), balance checks, gift rows in chat
- Host go-live setup: camera preview, title, category, engine choice (Agora / LiveKit / WebRTC), quality preset, adaptive bitrate, pre-flight check
- Host live room: timer, live viewers, incoming comments, gift alert banner, pin / mute / remove moderation, end stream
- Stream health diagnostics: 60 s bitrate chart vs target, FPS, latency, packet loss, resolution, connection details, reconnect log with exponential backoff, simulated network drop, debug overlay
- Post-stream summary: duration, peak viewers, views, new followers, comments, gifts earned, average latency, top supporters
- Coin wallet: balance, top-up packs, earnings, activity
- Creator profile (schedule, past streams) and own profile (weekly streamed hours, replays)
- Stream settings: quality, frame rate, adaptive bitrate, low-latency mode, auto-reconnect retries and backoff, default engine, QA toggles

## Tech stack
- Expo (SDK 58) + React Native + TypeScript, expo-router (stack + 5 tabs)
- Zustand for app and live-session state
- react-native-svg (bitrate chart), expo-linear-gradient, Sora + Syne via @expo-google-fonts
- node:test unit tests for the format, stream-health/backoff and wallet rules
- Maestro + GitHub Actions Android emulator for the real screenshots and demo GIF
- Stack reason: the job leaves the stack open ("stack flexible"), so the account owner's default (Expo / React Native + Zustand + TypeScript) was used; it also gives one codebase for iOS and Android, where the Agora, LiveKit and WebRTC SDKs all have React Native bindings.

## Industry
Media and entertainment, creator economy

## Metrics
Unpublished POC, no real usage metrics. Numbers on screen (viewers, gifts, bitrate, latency) are mock data. The design targets sub-400 ms latency with the Agora preset and a 3.0 Mbps 720p bitrate target.

## Research notes
- Verified: every screen runs in a release build on an Android emulator (screenshots and GIF captured by the capture workflow); unit tests cover health classification, the 1s-16s exponential backoff schedule, adaptive bitrate convergence, gift totals and payout conversion.
- Assumed / mocked: video and camera are photos; the RTC engines are a selection carried through the session, not SDK calls; viewer counts, chat, gifts and network stats come from a simulated 1 s broadcast clock; purchases and withdrawals are not wired to a payment provider.
- Design QA on the captured Android screenshots: 98/100 (grade A, media category), no Critical or Major findings. Fixed during QA: captions control, report/block menu, truncated creator name. Known minor issues: moderation is long-press only (hint shown), the Quality card sits under the sticky Go Live button until scrolled, summary numbers are seeded totals.
- Next steps: wire Agora (or LiveKit) publish/subscribe and feed its stats callbacks into the session store; a backend for chat (WebSocket), gifts ledger and coin purchases (store billing); push notifications for followed creators going live; an admin/moderation web console; replays and clips from cloud recording.
